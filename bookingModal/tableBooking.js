const mongoose = require("mongoose");
const tableBookingSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  people: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  restaurant:{
    type:String,
    required: true,
  }
});
const TableBooking = mongoose.model("TableBooking", tableBookingSchema);
module.exports = TableBooking;
