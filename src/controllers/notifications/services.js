const { Notification } = require('./models/notification');

const response = require('../base/response');
const serializer = require('../base/serializer');

const listNotification = async (req, res) => {
	try {
		// filter
		let filter_object = createFilterObject(req);
		// query filter
		let notifications = await Notification.find(filter_object).sort('-created_date')
		let notifications_full = [];
		for (let notification of notifications) {
			let notification_full = await serializer.convertOutput(notification);
			notifications_full.push(notification_full);
		}
		// result object with total document queried
		let result = {
			object: notifications_full,
			total: notifications_full.length
		};
		return response.ok(res, result);
	} catch (error) {
		response.internal(res, error);
	}

};

const setAsRead = async (req, res) => {
	try {
		let notifications = await Notification.find({ user_id: req.user._id, read: null });
		for (let notification of notifications) {
			notification.read = Date.now();
			await notification.save();
		}
		return response.noContent(res);
	} catch (error) {
		response.internal(res, error);
	}
};

const setAsReadById = async (req, res) => {
	try {
		let notification = await Notification.findById(req.params['notificationId']);
		if (!notification) return response.notFound(res, `Invalid Notification Id`);
		await notification.update({read: Date.now()});
		return response.ok(res);
	} catch (error) {
		response.internal(res, error);
	}
};

function createFilterObject(request) {
	if (request.query.only_unread === 'true')
		return {user_id: request.user.id, read: null};
	else if (request.query.only_unread === 'false') return {user_id: request.user.id, read: {$ne: null}};
	else return {user_id: request.user.id};
}

async function createNotifications(userAdminId, userGetNotify, data, eventType) {
	let notification_data;
	if(eventType === 'upgrade_to_admin') notification_data = dataChangeAdmin(userAdminId,userGetNotify,data);
	if(eventType ==='add_member'||eventType==='rm_member') notification_data = dataSubstation(userAdminId,userGetNotify,data);
	notification_data.event_type = eventType;
	return Notification.create(notification_data);
}

function dataChangeAdmin(userAdminId, userId, data){
	return{
		user_id: userId,
		data: {
			"user": {
				"_id": data._id,
				"full_name": data.full_name,
				"photo": data.photo,
				"email": data.email
			},
		},
		user_admin: userAdminId
	};
}

function dataSubstation(userAdminId, userId, data){
	return{
		user_id: userId,
		data: {
			"substation": {
				"_id": data._id,
				"name": data.name,
				"sub_id": data.sub_id,
				"owner_id": data.owner_id,
				"seed": data.seed
			},
		},
		user_admin: userAdminId
	};
}

module.exports = {
	listNotification,
	setAsRead,
	setAsReadById,
	createNotifications,
};
