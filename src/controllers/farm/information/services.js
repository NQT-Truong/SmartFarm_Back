const mongoose = require('mongoose');
const response = require('../../base/response');
const Information = require('./models/info');
const User = require('../../user/models/users');
const Seed = require('../seeds/models/seeds');
const serializer = require('../../base/serializer');
const notification = require('../../notifications/services');
const lodash = require('lodash');
const gateway = require('../../../../config/seeds').gateway;
const mail = require('../../base/mail');
const validation = require('../../base/validation');
const fieldRequire = require('./field_require');

/** Get some info of farms*/
async function getSubstation(req, res) {
    try{
        let full_infos = [];
        let farms = req.user.farms;
        for(let i=0;i<farms.length;i++){
            let info = await Information.findOne({sub_id: farms[i]});
            if(info) full_infos.push(await serializer.convertOutput(info))
        }
        response.ok(res, full_infos);
    }catch(err){
        log.error(err);
        return response.internal(res, err)
    }
}

/** Get information of farm*/
async function getSubById(req, res) {
    try{
        let info = await Information.findOne({sub_id: req.params.sub_id});
        if(!info) return response.notFound(res, "Farm doesn't exists!!!");
        if(!req.user.farms.includes(req.params.sub_id)) return response.forbidden(res, "Permission Denied!!!");
        let full_info = await serializer.convertOutput(info);
        return response.ok(res, full_info);
    }catch(err){
        log.error(err);
        return response.internal(res, err)
    }
}


async function newSubstation(req, res) {
    try{
        let data = req.body;
        let [err] = validation(data, fieldRequire.new_farm);
        if(err) throw err;

        if(!req.user.is_admin) return response.forbidden(res,"Permission Denied!!!");//1
        if(!gateway.includes(data.sub_id)) return response.badData(res, "Sensor doesn't exist!!!");//2
        let check_sub = await Information.findOne({sub_id: data.sub_id},{_id:1});
        if(check_sub) return response.badRequest(res,"Sensor has already in use!!!");
        let check_seed = await Seed.findById(data.seed,{_id:1});
        if(!check_seed) return response.notFound(res,"Seed isn't existed!!!");

        let new_farm = {
            name: data.name,
            sub_id: data.sub_id,
            started_plant: data.started_plant ? data.started_plant : Date.now(),
            owner_id: req.user._id,
            seed: data.seed,
            latitude: data.latitude,
            longitude: data.longitude
        };
        let farm = await Information.create(new_farm);
        await User.updateMany({is_admin:true},{ $push: {"farms": farm.sub_id}});
        let full_info = await serializer.convertOutput(farm);
        return response.created(res, full_info)
    }catch(err){
        log.error(err);
        return response.internal(res, err)
    }
}

/** Edit information of farm*/
async function editSub(req, res){
    let change_element = req.body;
    console.log(change_element.seed);
    try {
        if(!req.user.is_admin) return response.forbidden(res,"Permission Denied!!!");
        let old_farm = await Information.findOne({sub_id: req.params.sub_id});
        if(!old_farm) return response.badData(res, "Gateway doesn't exist!!!");
        if(change_element.seed) {
            let check_seed = await Seed.findById(change_element.seed);
            if (!check_seed) return response.notFound(res, "Seed doesn't existed!!!");
        }
        let data_seed={
            name: change_element.name ? change_element.name : old_farm.name,
            started_plant: change_element.started_plant ? change_element.started_plant : old_farm.started_plant,
            longitude: change_element.longitude ? change_element.longitude : old_farm.longitude,
            latitude: change_element.latitude ? change_element.latitude : old_farm.latitude,
            seed: change_element.seed ? change_element.seed : old_farm.seed,
        };
        let farm = await Information.findOneAndUpdate({sub_id:req.params.sub_id}, data_seed, {new:true});
        let full_info = await serializer.convertOutput(farm);
        response.ok(res, full_info)
    }catch (err) {
        log.error(err);
        response.internal(res, err)
    }
}

async function addSubToUser(req, res) {
    const {user_id, sub_id} = req.body;
    let user = {};
    try{
        if(!user_id) response.badData(res, "User Id is required");
        if(!sub_id) response.badData(res, "Sub Id is required");
        if(!req.user.is_admin) return response.forbidden(res,"Permission Denied!!!");
        let check_user = await User.findById(user_id);
        if(!check_user) return response.notFound(res,"User doesn't exist!!!");
        if(check_user.is_admin) return response.forbidden(res,"Permission Denied!!!");
        if(check_user.farms.length > sub_id.length){
            if(check_user.farms.length-sub_id.length!==1) return response.badData(res, "Remove only one!!!");
            let compare = lodash.difference(check_user.farms, sub_id);
            if(compare.length > 1) return response.badData(res, "Remove only one!!!");
            let farm = await Information.findOne({sub_id: compare[0]});
            if(!farm) return response.notFound(res,"Farm doesn't exist!!!");
            user = await User.findOneAndUpdate({_id:user_id},{ $pull: {"farms": compare[0]}},{new:true});
            await notification.createNotifications(req.user._id, user_id, farm, 'rm_member')
        }
        else{
            if(sub_id.length-check_user.farms.length!==1) return response.badData(res, "Add only one!!!");
            let compare = lodash.difference(sub_id, check_user.farms);
            if(sub_id.length-check_user.farms.length>1 && compare.length > 1) return response.badData(res, "Add only one!!!");
            let farm = await Information.findOne({sub_id: compare[0]},{name:1});
            if(!farm) return response.notFound(res,"Farm doesn't exist!!!");
            user = await User.findOneAndUpdate({_id:user_id},{ $push: {"farms": compare[0]}},{new:true});
            /** Mail*/
            const content = { user: user.full_name, farm: farm.name};
            mail.send(user.email, 'addFarm', content, async (err, msg) => {
                if (err) throw err;
            });
        }
        return response.created(res, user)
    }catch(err){
        log.error(err);
        return response.internal(res, err)
    }
}


/** Delete substation*/
async function deleteSub(req, res){
    try {
        if (!req.user.is_admin) return response.forbidden("Permission Denied!!!");
        await Information.findOneAndDelete({sub_id: req.params.sub_id});
        await User.updateMany({},{ $pull: {"farms": req.params.sub_id}});
        response.noContent(res)
    }catch (err) {
        log.error(err);
        response.internal(res, err);
    }
}

module.exports={
    getSubstation,
    getSubById,
    newSubstation,
    editSub,
    addSubToUser,
    deleteSub
};