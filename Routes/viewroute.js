const express = require("express");
const viewController = require("./../controller/viewController");
const restaurantController = require("./../controller/restaurantcontroller");
const router = express.Router();

router.get("/overview", viewController.overview);
router.get("/restaurant/:slug", viewController.getRestaurant);
router.get("/location/:city_name", viewController.getRestaurantonlocation);
router.get("/location/:location", restaurantController.getallrestaurants);
router.post("/location/:location/filter", viewController.filter);
router.get("/filter", viewController.filterdata);
module.exports = router;
