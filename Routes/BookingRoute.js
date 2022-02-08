const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController")
const authController = require("../controller/authcontroller");
router.route("/orderdetails").get(bookingController.getOrderDetails)
router.route("/order/success").post(bookingController.createOrderDetails)

module.exports=router;