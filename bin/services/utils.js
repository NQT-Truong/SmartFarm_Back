const lodash = require("lodash");
const schedule = require('node-schedule');
const moment = require('moment');

const Data = require("../../src/controllers/farm/data/models/data");
const mail = require("../../src/controllers/base/mail");
const config = require("../../config/config");
function objectNull() {
	return{
		value: null,
		battery: null,
		RF_signal: null
	}
}


function getDataSensor(data) {
	// log.info(data)
	return{
		value: data.value,
		battery: data.battery,
		RF_signal: data.RF_signal
	}
}

function convertData(data){
	return{
		sub_id: data.sub_id,
		T1: lodash.isObject(data.NODE25) ? getDataSensor(data.NODE25) : objectNull(),//
		T2: lodash.isObject(data.NODE26) ? getDataSensor(data.NODE26) : objectNull(),//

		H1: lodash.isObject(data.NODE21) ? getDataSensor(data.NODE21) : objectNull(),//
		H2: lodash.isObject(data.NODE22) ? getDataSensor(data.NODE22) : objectNull(),//


		PH1: lodash.isObject(data.NODE32) ? getDataSensor(data.NODE32) : objectNull(),//
		PH2: lodash.isObject(data.NODE33) ? getDataSensor(data.NODE33) : objectNull(),//


		L1: lodash.isObject(data.NODE23) ? getDataSensor(data.NODE23) : objectNull(),//
		L2: lodash.isObject(data.NODE24) ? getDataSensor(data.NODE24) : objectNull(),//


		SM1: lodash.isObject(data.NODE1) ? getDataSensor(data.NODE1) : objectNull(),
		SM2: lodash.isObject(data.NODE2) ? getDataSensor(data.NODE2) : objectNull(),
		SM3: lodash.isObject(data.NODE3) ? getDataSensor(data.NODE3) : objectNull(),
		SM4: lodash.isObject(data.NODE4) ? getDataSensor(data.NODE4) : objectNull(),
		SM5: lodash.isObject(data.NODE5) ? getDataSensor(data.NODE5) : objectNull(),
		SM6: lodash.isObject(data.NODE6) ? getDataSensor(data.NODE6) : objectNull(),
		SM7: lodash.isObject(data.NODE7) ? getDataSensor(data.NODE7) : objectNull(),
		SM8: lodash.isObject(data.NODE8) ? getDataSensor(data.NODE8) : objectNull(),
		SM9: lodash.isObject(data.NODE9)? getDataSensor(data.NODE9) : objectNull(),
		SM10: lodash.isObject(data.NODE10) ? getDataSensor(data.NODE10) : objectNull(),
		SM11: lodash.isObject(data.NODE11) ? getDataSensor(data.NODE11): objectNull(),
		SM12: lodash.isObject(data.NODE12) ? getDataSensor(data.NODE12) : objectNull(),
		SM13: lodash.isObject(data.NODE13) ? getDataSensor(data.NODE13) : objectNull(),
		SM14: lodash.isObject(data.NODE14) ? getDataSensor(data.NODE14) : objectNull(),
		SM15: lodash.isObject(data.NODE15) ? getDataSensor(data.NODE15) : objectNull(),
		SM16: lodash.isObject(data.NODE16) ? getDataSensor(data.NODE16) : objectNull(),
		SM17: lodash.isObject(data.NODE17) ? getDataSensor(data.NODE17) : objectNull(),
		SM18: lodash.isObject(data.NODE18) ? getDataSensor(data.NODE18) : objectNull(),
		SM19: lodash.isObject(data.NODE19) ? getDataSensor(data.NODE19) : objectNull(),
		SM20: lodash.isObject(data.NODE20) ? getDataSensor(data.NODE20) : objectNull(),
		time: data.time
	}
}

async function isReceiveData() {
	try{
		let dateNow = moment().format("YYYY-MM-DD");
		let isReceive = await Data.findOne(
			{
				created_date: {
					$gte: dateNow + " 00:00:00"
				}
			}
		);
		console.log(isReceive);
		return !!isReceive
	}
	catch (e) {
		log.error(e);
		return false
	}
}

function scheduleIsReceiveData(){
	try {
		let j = schedule.scheduleJob({hour: 12, minute: 0, second: 0}, async function(){
			let isReceive = await isReceiveData();
			if(!isReceive){
				await mail.sendMailWarning(config.emailAdmin, "Today, server not " +
					"receive data from gateway, please check!");
				await mail.sendMailWarning("nguyenthaihocptit@gamil.com", "Today, server not " +
					"receive data from gateway, please check!");
				log.info("Not receive data from gateway");
			}
			else log.info("Is Receive");
		});
	}
	catch (e) {
		log.error(e);
	}
}

scheduleIsReceiveData();

module.exports = {
	convertData
};