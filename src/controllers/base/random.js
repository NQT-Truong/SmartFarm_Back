/**
 * @description empty
 * @param {string} array 
 * @param {number} am 
 */
function createStr(array, am) {
    let result = '';
    let len = array.length;
    for (let i = 0; i < am; i++)
        result += array[Math.floor(Math.random() * len)];
    return result;
}

function number(amount) {
    const string = '0123456789';
    return createStr(string, amount);
}

function alphanumeric(amount) {
    const string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return createStr(string, amount);
}

module.exports = {
    number,
    alphanumeric
};
