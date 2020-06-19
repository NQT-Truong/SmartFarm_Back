let gateway = ['G00', 'G01', 'G02', 'G03', 'G04', 'G05', 'G06', 'G07', 'G08','G09', 'G10'];
let status = ['00', '01', '10', '11', '20', '21', '30', '31', 'A', 'O'];

const lodash = require('lodash');

function fakeData(sub_id) {
    // let id = gateway[Math.floor(Math.random() * gateway.length)];
    let T1 = Math.floor(Math.random() * (40 - 20) + 20);
    let T2 = Math.floor(Math.random() * (40 - 20) + 20);
    let H1 = Math.floor(Math.random() * (90 - 60) + 60);
    let H2 = Math.floor(Math.random() * (90 - 60) + 60);
    let L1 = Math.floor(Math.random() * (1000 - 800) + 800);
    let L2 = Math.floor(Math.random() * (1000 - 800) + 800);
    let PH1 = Math.floor(Math.random() * (12 - 8) + 8);
    let PH2 = Math.floor(Math.random() * (12 - 8) + 8);
    let SM1 = Math.floor(Math.random() * 100);
    let SM2 = Math.floor(Math.random() * 100);
    let SM3 = Math.floor(Math.random() * 100);
    let SM4 = Math.floor(Math.random() * 100);
    let SM5 = Math.floor(Math.random() * 100);
    let SM6 = Math.floor(Math.random() * 100);
    let SM7 = Math.floor(Math.random() * 100);
    let SM8 = Math.floor(Math.random() * 100);
    let SM9 = Math.floor(Math.random() * 100);
    let SM10 = Math.floor(Math.random() * 100);
    let SM11 = Math.floor(Math.random() * 100);
    let SM12 = Math.floor(Math.random() * 100);
    let SM13 = Math.floor(Math.random() * 100);
    let SM14 = Math.floor(Math.random() * 100);
    let SM15 = Math.floor(Math.random() * 100);
    let SM16 = Math.floor(Math.random() * 100);
    let SM17 = Math.floor(Math.random() * 100);
    let SM18 = Math.floor(Math.random() * 100);
    let SM19 = Math.floor(Math.random() * 100);
    let SM20 = Math.floor(Math.random() * 100);
    return{
        sub_id: sub_id,
        temp_1:{
            RF_signal: "TỐT",
            value: T1,
            battery: 98
        },
        temp_2:{
            RF_signal: "TỐT",
            value: T2,
            battery: 98
        },
        hum_1:{
            RF_signal: "TỐT",
            value: H1,
            battery: 98
        },
        hum_2:{
            RF_signal: "TỐT",
            value: H2,
            battery: 98
        },
        ph_1:{
            RF_signal: "TỐT",
            value: PH1,
            battery: 98
        },
        ph_2:{
            RF_signal: "TỐT",
            value: PH2,
            battery: 98
        },
        light_1:{
            RF_signal: "TỐT",
            value: L1,
            battery: 98
        },
        light_2:{
            RF_signal: "TỐT",
            value: L2,
            battery: 98
        },
        soil_1:{
            RF_signal: "TỐT",
            value: SM1,
            battery: 98
        },
        soil_2:{
            RF_signal: "TỐT",
            value: SM2,
            battery: 98
        },
        time: Date.now()
    }
    // return{
    //     sub_id: sub_id,
    //     sensor_1: {
    //         id: 123456,
    //         RF_signal: "Tốt",
    //     },
    //     sensor_2:{
    //         RF_signal: "Tốt",
    //         id: 12566,
    //         name: "Humidity",
    //         EOC: 34,
    //         value: 45,
    //         battery: 98
    //     },
    //     sensor_3:{
    //         RF_signal: "Tốt",
    //         id: 23456,
    //         name: "Soil moisture",
    //         EOC: 45,
    //         value: 60,
    //         battery: 90
    //     },
    //     time: Date.now()
    // }
}

function objectNull() {
    return{
        value: null,
        battery: null,
        RF_signal: null
    }
}

function convertData(data){
    return{
        sub_id: data.sub_id,
        T1: lodash.isObject(data.temp_1) ? data.temp_1 : objectNull(),
        T2: lodash.isObject(data.temp_2) ? data.temp_2 : objectNull(),
        H1: lodash.isObject(data.hum_1) ? data.hum_1 : objectNull(),
        H2: lodash.isObject(data.hum_2) ? data.hum_2 : objectNull(),
        PH1: lodash.isObject(data.ph_1) ? data.ph_1 : objectNull(),
        PH2: lodash.isObject(data.ph_2) ? data.ph_2 : objectNull(),
        L1: lodash.isObject(data.light_1) ? data.light_1 : objectNull(),
        L2: lodash.isObject(data.light_2) ? data.light_2 : objectNull(),
        SM1: lodash.isObject(data.soil_1) ? data.soil_1 : objectNull(),
        SM2: lodash.isObject(data.soil_2) ? data.soil_2 : objectNull(),
        SM3: lodash.isObject(data.soil_3) ? data.soil_3 : objectNull(),
        SM4: lodash.isObject(data.soil_4) ? data.soil_4 : objectNull(),
        SM5: lodash.isObject(data.soil_5) ? data.soil_5 : objectNull(),
        SM6: lodash.isObject(data.soil_6) ? data.soil_6 : objectNull(),
        SM7: lodash.isObject(data.soil_7) ? data.soil_7 : objectNull(),
        SM8: lodash.isObject(data.soil_8) ? data.soil_8 : objectNull(),
        SM9: lodash.isObject(data.soil_9)? data.soil_9 : objectNull(),
        SM10: lodash.isObject(data.soil_10) ? data.soil_10 : objectNull(),
        SM11: lodash.isObject(data.soil_11) ? data.soil_11 : objectNull(),
        SM12: lodash.isObject(data.soil_12) ? data.soil_12 : objectNull(),
        SM13: lodash.isObject(data.soil_13) ? data.soil_13 : objectNull(),
        SM14: lodash.isObject(data.soil_14) ? data.soil_14 : objectNull(),
        SM15: lodash.isObject(data.soil_15) ? data.soil_15 : objectNull(),
        SM16: lodash.isObject(data.soil_16) ? data.soil_16 : objectNull(),
        SM17: lodash.isObject(data.soil_17) ? data.soil_17 : objectNull(),
        SM18: lodash.isObject(data.soil_18) ? data.soil_18 : objectNull(),
        SM19: lodash.isObject(data.soil_19) ? data.soil_19 : objectNull(),
        SM20: lodash.isObject(data.soil_20) ? data.soil_20 : objectNull(),
        time: data.time
    }
}

// function convertControll(sub_id){
//     return{
//         sub_id: sub_id,
//         relay_1: { RF_signal: 'RẤT TỐT', value: '00', battery: 100 },
//         relay_2: { RF_signal: 'RẤT TỐT', value: '10', battery: 100 } }
//     }
// }

module.exports ={
    fakeData,
    convertData
};