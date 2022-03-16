const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController");
router.route("/orderdetails").get(bookingController.getOrderDetails);
router.route("/tablebooking").post(bookingController.createTablebooking);
router.route("/order/success").post(bookingController.createOrderDetails);

module.exports = router;
