const fs = require('fs');


// Sort object A-z
function sortObject(obj) {
    const ordered = {};
    Object.keys(obj).sort().forEach(function (key) {
        ordered[key] = obj[key];
    });
    return ordered;
}

// Compare object by string
function compareObject(obj1, obj2) {
    obj1 = sortObject(obj1);
    obj2 = sortObject(obj2);
    return Object.entries(obj1).toString() === Object.entries(obj2).toString();
}

module.exports = {
    sortObject,
    compareObject
};