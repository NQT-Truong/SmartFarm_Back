const mongoose = require('mongoose');

const camera = new mongoose.Schema({
	cameraId: {
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    },
	created_date: {
		type: Date,
		default: new Date()
	}
}, {versionKey: false});


const Camera = mongoose.model("farm_camera", camera);
module.exports = {
    Camera:Camera,
    
};