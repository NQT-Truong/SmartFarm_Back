const mongoose = require('mongoose');

const ControlSchema = new mongoose.Schema({
    sub_id: {
        type: String,
        required: true
    },
    relay_1: {value: String, battery: String, RF_signal: String},
    relay_2: {value: String, battery: String, RF_signal: String},
    created_date: {
        type: Date,
        default: Date.now()
    },
    date_sync: {
        type: Date
    }
},{ versionKey: false });

const Control = mongoose.model("farm_control", ControlSchema);
module.exports = Control;