const lodash = require('lodash');

const seeds = require('../../config/seeds');
const Data = require('../../src/controllers/farm/data/models/data');
const Control = require('../../src/controllers/farm/data/models/control');
const Seed = require('../../src/controllers/farm/seeds/models/seeds');
const Information = require('../../src/controllers/farm/information/models/info');
const serializer = require('../../src/controllers/base/serializer');

/**----------------Init-----------------*/
/**Difference between 2 objects*/
function difference(oldObj, newObj) {
    return lodash.transform(oldObj, (result, value, key) => {
        if (!lodash.isEqual(value, newObj[key])) {
            result[key] = lodash.isObject(value) && lodash.isObject(newObj[key]) ? difference(value, newObj[key]) : newObj[key];
        }
    });
}

/**Checking seed's existence*/
/**Update seed according to the configuration file.*/
async function checkExist(newObj){
    try {
        let oldObj = await Seed.findOne({seed: newObj.seed},{_id:0}).lean();
        if(!oldObj) await Seed.create(newObj);
        else{
            let diff = difference(oldObj, newObj);
            if(!lodash.isEmpty(diff)) await Seed.findOneAndUpdate({seed:newObj.seed},newObj)
        }
    }catch (err) {
        throw err
    }
}

/**Create new seeds according to the configuration file. */
async function newSeed() {
    try{
        await checkExist(seeds.tomato);
        await checkExist(seeds.pakchoi);
        await checkExist(seeds.brassica);
        await checkExist(seeds.cucumber);
        await checkExist(seeds.cabbage);
    }catch (err) {
        throw err
    }
}

/** Save data sensor*/
async function saveData(obj){
    try{
        await Data.create(obj)
    }catch(err){
        throw err
    }
}

async function saveCtrl(obj){
    try{
        let dataCtrl = await Control.findOne({sub_id: obj.sub_id});
        if(dataCtrl) await Control.findOneAndUpdate({sub_id: obj.sub_id}, obj);
        else await Control.create(obj)
    }catch(err){
        throw err
    }
}

async function automation(sub_id, data){
    try{
        let farm = await Information.findOne({sub_id: sub_id});
        if(farm) {
            let full_farm = await serializer.convertOutput(farm);
            let condition = full_farm.stage;
            return data.soil_1.value < condition.min_soil_moisture;
        }
    }catch(err){
        throw err;
    }
}

function onCtrl(){
    return{
        sub_id: 'G05',
        relay_1: { value: '01' },
        relay_2: {}
    }
}

module.exports={
    saveData,
    newSeed,
    automation,
    onCtrl,
    saveCtrl
};


