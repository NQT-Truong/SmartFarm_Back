/**
 * Module:    Quản lý lịch sử log
 * Author:    Harian
 * @version:  v2.0.1
 * Create:    9/2019    by @Haian
 * Modified:  09/03/2019 by @Haian
 *
 */

const colors = require('colors');
const winston = require('winston');
const moment = require('moment');
const path = require('path');
const lodash = require('lodash');
const util = require('util');
const debug = require('debug')('debug:logHistory');
require('winston-daily-rotate-file');

// const config = require('config');

// console.log = function() {}; // Off console.log

/**
 * Ghi log ra file theo từng ngày:
 *    log thường info -> storage/logs: Bao gồm cả logs và errors
 *              error -> storage/error: Chỉ có các errors
 * @example log.info(["app.js", "Info_messages"])
 * @example log.error(["app.js", "Err_messages"])

 */
let storage_root = path.join(__dirname, '../../storage');
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5
};
const charOfLevel = [' |E| ', ' |W| ', ' |I| ', ' |V| ', ' |D| ', ' |S| '];
const MAX_PAD = 25;

function getFileName(){
    let date = new Date();
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}.log`;
}

function resolveMessage(message) {
    // if( !message )
    //     return message;

    // var log;
    // console.log = function() {
    //     log = [].slice.call(arguments);
    // };
    // lodash.isObject(message)
    //     console.log( util.inspect(message, false, null, true) )
    // debug(log)



    return util.inspect(message, false, null, false).slice(0, 1000);
}
function prepareString(object, isConsole) {
    let file = object.message[0].substr(0,MAX_PAD);
    file = file.padEnd(MAX_PAD)  + ' | ';

    let level = levels[object.level];
    let message = object.message[1]; //console.log(message)
    if( !lodash.isString(message) )
        message = resolveMessage( message ); //console.log(message)

    let time =`${moment().format('HH:mm:ss')}`;
    let charLevel = charOfLevel[level];

    function color(message) {
        if(isConsole && process.env.NODE_ENV !== "production"){
            file = file.blue;
            if( message )
                try {
                    switch (level) {
                        case levels.error:
                            message = message.red;
                            break;
                        case levels.warn:
                            message = message.yellow;
                            break;
                        case levels.info:
                            message = message.green;
                            break;
                    }
                } catch(e){}
        }
        return time + charLevel + file + message;
    }



    return message.split("\n").map( cur => color(cur) ).join('\n');

}

function _getCallerFile(lineNumber="") {
    let originalFunc = Error.prepareStackTrace;
    let callerfile;
    try {
        let err = new Error();
        let currentfile;

        Error.prepareStackTrace = function (e, stack) { return stack; };
        currentfile = err.stack.shift().getFileName();
        while (err.stack.length) {
            callerfile = err.stack.shift().getFileName();

            if(currentfile !== callerfile) break;
        }
    } catch (e) {}
    Error.prepareStackTrace = originalFunc;

    return path.basename(path.dirname(callerfile)) + '/' + path.basename(callerfile) + lineNumber;
}

const log = winston.createLogger({
    format: winston.format.json(),
    transports: lodash.flatten([
        process.env.NODE_ENV === "production"
        ?   [new (winston.transports.DailyRotateFile)({
                  filename: path.join(storage_root, 'error', 'server-%DATE%.log'),
                  datePattern: 'YYYY-MM-DD',
                  zippedArchive: false,
                  maxSize: '20m',
                  maxFiles: '14d',
                  level: 'error',
                  format: winston.format.printf(error => {
                      return prepareString(error);
                  } )
            }),
              new (winston.transports.DailyRotateFile)({
                  filename: path.join(storage_root, 'log', 'server-%DATE%.log'),
                  datePattern: 'YYYY-MM-DD',
                  zippedArchive: false,
                  maxSize: '20m',
                  maxFiles: '14d',
                  level: 'info',
                  format: winston.format.printf(info => {
                      return prepareString(info);
                  } )
              })]
        :   new winston.transports.Http(),
        new winston.transports.Console({
            colorize: true,
            level: 'info',
            format: winston.format.printf(info => {
                return prepareString(info, true);
            } )
        })
    ])
});

function deleteLogTooOld() {

}

function getCallerFunction(error, line=2) { //debug(error)
    let frame = error.stack.split("\n")[line];
    if(frame.split(path.sep).length <= 2)
        frame = error.stack.split("\n")[line+1];
    let arrFrame = frame.split(path.sep);
    let functionName = frame.split(" ")[5];

    let countColon = (frame.match(/:/g) || []).length;
    let lineNumber = countColon === 2
        ? frame.split(":")[1]
        : frame.split(":")[2];
    if(!lineNumber)
        lineNumber = '0';

    let callerFile = arrFrame[arrFrame.length-2] + "/" + arrFrame[arrFrame.length-1].split(":")[0];
    callerFile = callerFile.substr(0,MAX_PAD-lineNumber.length-1);
    return [callerFile, functionName, lineNumber];
}

function error(message){
    try {
        let [err, line] = !message || !message.message ? [new Error(), 2] : [message, 1];
        let [callerFile, functionName, lineNumber] = getCallerFunction(err, line);
        debug( (callerFile + "/"  + functionName + ":"  + lineNumber).red);
        log.error([callerFile + ":"  + lineNumber, message]);
    } catch(err){
        log.error(['log/logError:182', message]);
    }
}

function warn(message){
    try {
        let [err, line] = !message || !message.message ? [new Error(), 2] : [message, 1];
        let [callerFile, functionName, lineNumber] = getCallerFunction(err, line);
        debug((callerFile + "/" + functionName + ":" + lineNumber).yellow);
        log.warn([callerFile + ":" + lineNumber, message]);
    } catch(err){
        log.warn(['log/logWarn:193', message]);
    }
}

function info(message){
    try {
        let [callerFile, functionName, lineNumber] = getCallerFunction(new Error());
        log.info([callerFile + ":"  + lineNumber, message]);
    } catch(err){
        log.warn(['log/logInfo:202', message]);
    }
}

global.log = {
    error,
    warn,
    info,
};

module.exports = {
    error,
    warn,
    info,
};

