
const debug = require("debug")("debug: apiImageCamera");
const response = require('../base/response');
const {Camera} = require('./models/camera');
const asyncBusboy = require('async-busboy');
const {saveImageAs} = require('../../untils/image');
const moment = require('moment');

async function getCameraPhoto(req, res){
    let fromdate = req.query.fromdate ? moment(req.query.fromdate,"DD-MM-YYYY").format("YYYY-MM-DD 00:00:00") :moment().format("2020-01-01 00:00:00");
    let todate = req.query.todate     ? moment(req.query.todate,"DD-MM-YYYY").format("YYYY-MM-DD 23:59:59")   :moment().format("2020-01-01 23:59:59");
    console.log(
        fromdate,
todate
    );
    try{
        let photo = await Camera.find({
            created_date:{
                $gte: fromdate,
                $lte: todate
            }
        }).limit(1000).sort({$natural:-1});
        return response.ok(res, photo);
    }catch(err){
        log.error(err);
        return response.internal(res, err)
    }
}

async function newPhoto(req, res) {
    try{
        let data = await asyncBusboy(req);
        // check data
        if(!data.fields.cameraId) return response.badData(res,'CameraId is require');
        if(!data.files[0]) return response.badData(res,'Photo is require');
        if(data.files[0].fieldname!=='photo') return response.badData(res,'File fiels is photo');
        // save image
        let link = await saveImageAs('camera',`${data.fields.cameraId}_${moment().format('YYYY_MM_DD_HH_mm_ss')}.jpg`,data.files[0]);
        if(!link) return response.badRequest(res,"Can't save file");
        let new_photoCamera = {
            cameraId: data.fields.cameraId,
            url: link
        };
        let result = await Camera.create(new_photoCamera);
        return response.created(res, result)
    }catch(err){
        log.error(err);
        return response.internal(res, err)
    }
}

module.exports={
    getCameraPhoto: getCameraPhoto,
    newPhoto: newPhoto,
}