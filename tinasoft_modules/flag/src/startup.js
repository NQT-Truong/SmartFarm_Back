#!/usr/bin/env node

/**
 * Module:    Setup flag to check starting up of app
 * Author:    Tinasoft.vn
 * @version:  v3.0.1
 * Create:    5/2019
 * Modified:  9/2019
 *
 */

const flag = require('./flag');

const iconCheck = '✔ v';
const iconUncheck = '💀 x';
const MAX_TRY = 5;
const RESTART_AFTER = 10;

let curStep = 1;
let tryCounter = 0;
let timerSelfTryAgain = null;
let startup = {};
let logging = setLog(false);

function setLog(logEnable){
    return {
        log: logEnable === false ? () => {} : console.log,
        warn: logEnable === false ? () => {} : console.warn,
        error: logEnable === false ? () => {} : console.error
    };
}

function start(toDoList, logOn = false) {
    logging = setLog(logOn);
    startup = toDoList.reduce( (acc, cur, ind) => {
        for(let key in cur){
            Object.assign(acc, {
                [key]: new flag.Variant({step: ind+1, path: cur[key]}, [true]),
            })
        }
        return acc;
    }, {});
    // logging.log(startup);
    preset();
}

// preset();
function preset(){
    flag.assign(startup);
    createTimer();

    logging.log("Starting up... ");
    checkStartup(null, false);
}

function checkStartup(keyProactive, isProactive=true){
    try {
        if (isProactive ) {
            let value = flag.getValue(keyProactive);
            if(value === true || value === undefined)
                return;
            flag.setValue({[keyProactive]: true});
            let msg = `${iconCheck}`.brightGreen + ' ' + keyProactive.brightGreen + '\t';
            logging.log(msg);
        } else
            tryCounter++;
        if (tryCounter >= MAX_TRY) {
            return;
        }

        // Duyệt object
        let isContinue = false;
        let isFounded = false;
        for (let key in startup) {
            let value = flag.getValue(key);
            if (value === true) {
                continue;
            }

            isContinue = true;
            if (value.step === curStep) {
                isFounded = true;
                if (isProactive === false)
                    try {
                        require(value.path);
                    } catch (e) {
                        value = flag.getValue(key);
                        let msg = `${value === true ? iconCheck : iconUncheck}`.brightRed + ' ' + key.brightRed + '\t';
                        logging.warn(msg + '\t' + e.message);
                    }
            }
        }

        // Kiểm tra kết thúc
        if (isFounded)
            return;
        if (isContinue) {
            nextStep()
        } else {
            clearTimeout(timerSelfTryAgain);
            logging.log("All ready!!!");
        }
    } catch(err){
        logging.error(err);
    }
}

function nextStep() {
    curStep++;
    tryCounter = 0;
    checkStartup(null, false);

}

function countDown(message, count) {
    logging.log(message);
    let interval = setInterval( ()=>{
        logging.log(count--);
        if( count < 1 ){
            clearInterval(interval);
            preset();
        }
    }, 1000);
}

function notificationFalse(time=RESTART_AFTER){
    logging.error("False to startup server:");
    for(let key in startup){
        logging.error( (flag.getValue(key) === true ? iconCheck : iconUncheck) + ' ' + key);
    }
    countDown("Start up false! Restart after: ", time);
}

function createTimer(){
    if( !timerSelfTryAgain )
        clearTimeout(timerSelfTryAgain);
    timerSelfTryAgain = setTimeout( ()=>{
        notificationFalse(3);
    }, RESTART_AFTER * 1000);
}


module.exports = {
    start,
    checkStartup,
}


