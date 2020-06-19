const jwt = require('jsonwebtoken');

const User = require('../user/models/users');
const response = require('../base/response');
const serializer = require('../base/serializer');
const configJWT = require('../../../config/config').jwt;
const otp = require('../base/otp');
const mail = require('../base/mail');
const random = require('../base/random');
const validation = require('../base/validation');
const fieldAuth = require('./field_auth');

/** Register */
async function register(req, res) {
	try {
		let [err] = validation(req.body, fieldAuth.register);
		if (err) throw err;
		let info = {
			full_name: req.body.full_name,
			email: req.body.email,
			password: req.body.password,
			phone_number: req.body.phone_number,
			gender: req.body.gender,
			address: req.body.address
		};
		let number_of_user = await User.find().countDocuments();
		if (number_of_user === 0) info.is_admin = true;
		let check_email = await User.findOne({email: req.body.email});
		if (check_email) return response.badRequest(res, 'Email is already in use.');
		let user = await User.create(info);
		/** creating token*/
		let token = otp.generateOTP(user.email, user.phone_number, user.last_login);
		console.log(token);
		/** SMS*/
		// await otp.sendOtpCode(user.phone_number, token);
		/** Mail*/
		const content = {user: user.full_name, token: token};
		mail.send(user.email, 'verify', content, async (err, msg) => {
			if (err) throw err;
		});
		return response.created(res, {_created_message: `Your account has been successfully created!`});
	} catch (err) {
		log.error(err);
		return response.internal(res, err);
	}
}

/** Login */
async function login(req, res) {
	try {
		let [err] = validation(req.body, fieldAuth.login);
		if (err) throw err;

		const email = req.body.email;
		const password = req.body.password;

		let user = await User.findOne({email: email}, {__v: 0});
		if (!user) return response.badRequest(res, "Email doesn't exists!!!");
		if (!user.is_active) return response.forbidden(res, "User isn't active!!!");
		user.comparePassword(password, async (err, isMatch) => {
			if (err || !isMatch) return response.badRequest(res, 'Wrong password!!!');
			const auth_token = jwt.sign({_id: user._id}, configJWT.secret, {expiresIn: configJWT.tokenLife});
			await User.findByIdAndUpdate(user._id, {last_login: Date.now()}, {new: true});
			let user_info = Object.assign({auth_token}, user.toJSON());
			let full_user = await serializer.convertOutput(user_info);
			return response.ok(res, full_user);
		});
	} catch (err) {
		log.error(err);
		return response.internal(res, err);
	}
}

/**
 * @Description Middleware check authentication!
 * 1.Get token by req.header.authorization
 * 2.Verify token
 * 3.(correct) next() || (err) return(err)
 * @param req
 * @param res
 * @param next
 */
function authentication(req, res, next) {
	try {
		let token = req.headers['x-access-token'] || req.headers['authorization'];
		if (!token) return response.unauthorized(res, 'Auth token is not supplied');
		if (token.startsWith('Bearer ')) token = token.slice(7, token.length);
		jwt.verify(token, configJWT.secret, async (err, decoded) => {
			if (err) return response.unauthorized(res, 'Token is not valid');
			else {
				// req.user = await User.findById(decoded._id, {__v: 0});
				req.user = await User.findById(decoded._id);
				if(!req.user) return response.unauthorized(res, 'Token is not valid');
				// console.log(req.user)
				next();
			}
		});
	} catch (err) {
		log.error(err);
		return response.internal(res, err);
	}
}

/**OTP*/
async function verifyOtp(req, res) {
	let {email, code} = req.body;
	try {
		let [err] = validation(req.body, fieldAuth.verify);
		if (err) throw err;
		let user = await User.findOneAndUpdate({email: email}, {last_login: Date.now()});
		if (!user) return response.badData(res, "User doesn't exist!!!");
		if (!otp.verifyOTP(code, user.email, user.phone_number, user.last_login)) return response.badData(res, "OTP Code is wrong or outdated!!!");
		await User.findOneAndUpdate({email: email}, {is_active: true});
		response.noContent(res);
	} catch (err) {
		log.error(err);
		return response.internal(res, err);
	}
}

async function refreshOTP(req, res) {
	let {email} = req.body;
	try {
		let [err] = validation(req.body, fieldAuth.refresh);
		if (err) throw err;
		let user = await User.findOneAndUpdate({email: email}, {last_login: Date.now()}, {new: true});
		if (!user) return response.badData(res, "User doesn't exist!!!");
		if (user.is_active) return response.unprocessableEntity(res, {message: "User has active!!!"});
		let token = otp.generateOTP(user.email, user.phone_number, user.last_login);
		console.log(token);
		/**SMS*/
		// await otp.sendOtpCode(user.phone_number, token);
		/**Mail*/
		const content = {user: user.full_name, token: token};
		mail.send(user.email, 'verify', content, async (err, msg) => {
			if (err) throw err;
		});
		response.noContent(res);
	} catch (err) {
		log.error(err);
		response.internal(res, err)
	}
}

async function recoveryPassword(req, res) {
	let {email} = req.body;
	try {
		if (!email) return response.badData(res, "Email field not found");
		let user = await User.findOne({email: email});
		if (!user) return response.badData(res, "User doesn't exist!!!");
		let new_pass = random.alphanumeric(8);
		console.log(new_pass);
		user.password = new_pass;
		await user.save();
		/**Mail*/
		const content = {user: user.full_name, token: new_pass};
		mail.send(user.email, 'verify', content, async (err, msg) => {
			if (err) throw err;
		});
		response.noContent(res);
	} catch (err) {
		log.error(err);
		response.internal(res, err);
	}
}

module.exports = {
	register,
	login,
	authentication,
	verifyOtp,
	refreshOTP,
	recoveryPassword
};