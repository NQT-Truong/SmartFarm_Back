let tomato = {
    seed: "tomato",
    stage_1:{
        name: "germination stage",
        stage_days: 30,
        min_temp: 15,
        max_temp: 20,
        min_light: 2000,
        max_light: 2300,
        min_PH: 5.5,
        max_PH: 7,
        min_soil_moisture: 70,
        max_soil_moisture: 80,
        min_hum: 45,
        max_hum: 60
    },
    stage_2:{
        name: "development stage",
        stage_days: 60,
        min_temp: 21,
        max_temp: 30,
        min_light: 2000,
        max_light: 3000,
        min_PH: 5.5,
        max_PH: 7,
        min_soil_moisture: 70,
        max_soil_moisture: 80,
        min_hum: 85,
        max_hum: 90
    },
    stage_3:{
        name: "harvest stage",
        stage_days: 70,
        min_temp: 21,
        max_temp: 30,
        min_light: 2000,
        max_light: 3000,
        min_PH: 5.5,
        max_PH: 7,
        min_soil_moisture: 70,
        max_soil_moisture: 80,
        min_hum: 85,
        max_hum: 90
    }
};

let pakchoi = {
    seed: "pakchoi",
    stage_1:{
        name: "germination stage",
        stage_days: 10,
        min_temp: 15,
        max_temp: 18,
        min_light: 2000,
        max_light: 2300,
        min_PH: 6,
        max_PH: 6.5,
        min_soil_moisture: 75,
        max_soil_moisture: 85,
        min_hum: 80,
        max_hum: 90
    },
    stage_2:{
        name:"development stage",
        stage_days: 25,
        min_temp: 15,
        max_temp: 22,
        min_light: 2000,
        max_light: 3200,
        min_PH: 6,
        max_PH: 6.5,
        min_soil_moisture: 70,
        max_soil_moisture: 80,
        min_hum: 70,
        max_hum: 80
    },
    stage_3:{
        name: "harvest stage",
        stage_days: 15,
        min_temp: 22,
        max_temp: 30,
        min_light: 2600,
        max_light: 3000,
        min_PH: 6,
        max_PH: 6.5,
        min_soil_moisture: 70,
        max_soil_moisture: 80,
        min_hum: 45,
        max_hum: 60
    },
};

let brassica = {
    seed: "brassica",
    stage_1:{
        name: "germination stage",
        stage_days: 10,
        min_temp: 18,
        max_temp: 20,
        min_light: 2000,
        max_light: 2300,
        min_PH: 5.5,
        max_PH: 7,
        min_soil_moisture: 75,
        max_soil_moisture: 85,
        min_hum: 80,
        max_hum: 90
    },
    stage_2:{
        name: "development stage",
        stage_days: 25,
        min_temp: 20,
        max_temp: 25,
        min_light: 2000,
        max_light: 3200,
        min_PH: 5.5,
        max_PH: 7,
        min_soil_moisture: 70,
        max_soil_moisture: 80,
        min_hum: 45,
        max_hum: 60
    },
    stage_3:{
        name: "harvest stage",
        stage_days: 10,
        min_temp: 20,
        max_temp: 25,
        min_light: 2600,
        max_light: 3000,
        min_PH: 5.5,
        max_PH: 7,
        min_soil_moisture: 70,
        max_soil_moisture: 80,
        min_hum: 45,
        max_hum: 60
    },
};

let cucumber = {
    seed: "cucumber",
    stage_1:{
        name: "germination stage",
        stage_days: 10,
        min_temp: 20,
        max_temp: 22,
        min_light: 2000,
        max_light: 2300,
        min_PH: 5.5,
        max_PH: 6.5,
        min_soil_moisture: 75,
        max_soil_moisture: 80,
        min_hum: 85,
        max_hum: 90
    },
    stage_2:{
        name: "development stage",
        stage_days: 30,
        min_temp: 20,
        max_temp: 30,
        min_light: 2000,
        max_light: 3000,
        min_PH: 5.5,
        max_PH: 6.5,
        min_soil_moisture: 75,
        max_soil_moisture: 80,
        min_hum: 85,
        max_hum: 90
    },
    stage_3:{
        name: "harvest stage",
        stage_days: 30,
        min_temp: 20,
        max_temp: 30,
        min_light: 2600,
        max_light: 3000,
        min_PH: 5.5,
        max_PH: 6.5,
        min_soil_moisture: 75,
        max_soil_moisture: 80,
        min_hum: 85,
        max_hum: 90
    },
};

let cabbage = {
    seed: "cabbage",
    stage_1:{
        name: "germination stage",
        stage_days: 30,
        min_temp: 15,
        max_temp: 18,
        min_light: 2000,
        max_light: 2300,
        min_PH: 6,
        max_PH: 6.5,
        min_soil_moisture: 75,
        max_soil_moisture: 85,
        min_hum: 80,
        max_hum: 90
    },
    stage_2:{
        name: "development stage",
        stage_days: 40,
        min_temp: 15,
        max_temp: 25,
        min_light: 2000,
        max_light: 3000,
        min_PH: 6,
        max_PH: 6.5,
        min_soil_moisture: 75,
        max_soil_moisture: 85,
        min_hum: 80,
        max_hum: 90
    },
    stage_3:{
        name: "harvest stage",
        stage_days: 20,
        min_temp: 15,
        max_temp: 25,
        min_light: 2600,
        max_light: 3000,
        min_PH: 6,
        max_PH: 6.5,
        min_soil_moisture: 75,
        max_soil_moisture: 85,
        min_hum: 80,
        max_hum: 90
    }
};

let gateway = [
    'G00', 'G01', 'G02', 'G03', 'G04', 'G05', 'G06', 'G07', 'G08',
    'G09', 'G10'
];

module.exports ={
    tomato,
    pakchoi,
    brassica,
    cucumber,
    cabbage,
    gateway
};