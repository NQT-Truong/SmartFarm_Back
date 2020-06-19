const fs = require('fs');
const path = require('path');

const {media} = require('config');
const adminCfHelper = require('./helper');

let AdminConfig, valueType;
let dirname;

const storage_root = media.STORAGE_ROOT || '';

function setDirname(newPath) {
    dirname = newPath;
    let modalPath = path.join(dirname, '../src/controllers/admin/models/admin');
    AdminConfig = require(modalPath).AdminConfig;
    valueType = require(modalPath).valueType;
}


const adminConfig = {
    path: `/config.json`,
    folder: storage_root + '/admin',
    full_path: storage_root + '/admin/config.json'
};

async function getConfig() {
    try {
        const configInDb = await getConfigFromDb();
        const configInFile = getConfigFromFile();

        // Both of them are the same
        let isSame = adminCfHelper.compareObject(configInDb, configInFile);
        if (isSame)
            return configInFile;

        // If not :(
        writeConfigToFile(configInDb);
        return configInDb;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function setConfig(object) {
    try {
        if (!fs.existsSync(adminConfig.full_path))
            fs.mkdirSync(adminConfig.folder);

        const keys = Object.keys(object);
        const values = Object.values(object);
        const types = values.map(item => typeof item);

        for (const [i, item] of keys.entries()) {
            await AdminConfig.update({
                value: values[i],
                type: types[i]
            }, {
                where: {key: item}
            });
        }
        let configInDb = await getConfigFromDb();
        writeConfigToFile(configInDb);
        return configInDb;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


// Read
function getConfigFromFile() {
    let config = fs.readFileSync(adminConfig.full_path, 'utf8');
    return JSON.parse(config);
}

async function getConfigFromDb() {
    let config = await AdminConfig.findAll({
        raw: true, nest: true
    });
    return formatConfig(config);
}

// Write
function writeConfigToFile(dataJson) {
    fs.writeFileSync(adminConfig.full_path, JSON.stringify(dataJson, null, 4));
}


function formatConfig(data) {
    let result = {};
    data.forEach(item => {
        let value = getRealValue(item.value, item.type);
        result = {...result, [item.key]: value}
    });
    result = adminCfHelper.sortObject(result);
    return result;
}

function getRealValue(raw, type) {
    let realValue;
    switch (type) {
        case valueType.STRING:
            realValue = raw ? raw.toString() : '';
            break;

        case valueType.NUMBER:
            realValue = parseInt(raw);
            break;

        case valueType.BOOLEAN:
            realValue = raw.toLowerCase() === 'true';
            break;

        default:
            break;
    }
    return realValue;
}

module.exports = {
    setDirname: setDirname,
    get: getConfig,
    set: setConfig
};
