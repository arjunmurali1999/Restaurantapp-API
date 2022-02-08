const express = require("express");
const cors=require("cors")
const router = express.Router();
const restaurantcontroller = require("../controller/restaurantcontroller");
const authcontroller = require("./../controller/authcontroller");
const menucontroller = require("./../controller/menucontroller");

router
  .route("/cheap-res-stats")
  .get(
    authcontroller.protect,
    restaurantcontroller.topcheap,
    restaurantcontroller.getallrestaurants
  );

router
  .route("/res-stats")
  .get(authcontroller.protect, restaurantcontroller.getRestaurantStats);

router
  .route("/")
  .get(restaurantcontroller.getallrestaurants)
  .post(
    authcontroller.protect,
    authcontroller.restrictTo("admin", "Developer"),
    restaurantcontroller.createrestaurant
  );
router.route("/menu").get(menucontroller.getallmenu)
router
  .route("/:id")
  // .get(authcontroller.protect, restaurantcontroller.getrestaurants)
  .get( restaurantcontroller.getrestaurantonid)
  .patch(
    authcontroller.protect,
    authcontroller.restrictTo("Developer"),
    restaurantcontroller.updateRestaurant
  )
  .delete(
    authcontroller.protect,
    authcontroller.restrictTo("Developer"),
    restaurantcontroller.deleteRestaurant
  );

module.exports = router;
