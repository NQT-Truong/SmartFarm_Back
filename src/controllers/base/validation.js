const response = require('./response');
const lodash = require('lodash');

function validation(req, method_field) {
    try {
        let opera = Object.keys(req);
        let diff = method_field.filter(e => !opera.includes(e));
        if(diff.length!==0)return [response.error(response.badData, `${diff[0]} is required !!!`)]
        else return [null]
    }catch (err) {
        return [err]
    }
}

module.exports = validation;