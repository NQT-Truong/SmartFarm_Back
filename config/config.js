const jwt = require("./jwt");
const network = require("./network");
const mongo = require("./database");
const otp = require("./otp");
const mqtt = require("./config_mqtt");


module.exports = {
	mqtt,
	jwt,
	network,
	mongo,
	otp,
	emailAdmin: "echcomcodon@gmail.com"
};