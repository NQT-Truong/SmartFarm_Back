const mongoose = require("mongoose");

const SubstationSchema = new mongoose.Schema(
  {
    Station: {
      type: String,
      required: true,
    },
    Temp: { type: String },
    Humi: { type: String },
    Light: { type: String },
    created_date: {
      type: Date,
      default: Date.now(),
    },
  },
  { versionKey: false }
);

//Nen thiet kế theo 3 bảng : Nhà, thiết bị và data thì có thể thêm được nhà, thiết bị riêng k phải sửa code

const Data = mongoose.model("farm_data", SubstationSchema);
module.exports = Data;
