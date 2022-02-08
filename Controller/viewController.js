const Restaurant = require("./../RestaurantModal/restaurantmodel");
const AppError = require("./../apiFeatures/appError");
const User = require("./../userModal/userModal");
const mealType = require("./../mealtypeModal/mealtypeModal");
const catchAsync = require("./catchasync");
const axios = require("axios");
const session = require("express-session");

exports.overview = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurant.find();
  const mealtype = await mealType.find();
  res
    .status(200)
    .set(
      "Content-Security-Policy",
      "default-src * self blob: data: gap:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap:; object-src * 'self' blob: data: gap:; img-src * self 'unsafe-inline' blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;"
    )
    .render("pugtemplate", {
      title: "Restaurants",
      restaurants,
      mealtype,
    });
});
exports.getRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.find({ slug: req.params.slug });
  res
    .status(200)
    .set(
      "Content-Security-Policy",
      "default-src * self blob: data: gap:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap:; object-src * 'self' blob: data: gap:; img-src * self 'unsafe-inline' blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;"
    )
    .render("restaurantpug", {
      restaurant,
    });
});

exports.getRestaurantonlocation = catchAsync(async (req, res, next) => {
  global.location = req.params.city_name;
  let restaurants = await Restaurant.find({
    city_name: req.params.city_name,
  }).limit(2);
  res
    .status(200)
    .set(
      "Content-Security-Policy",
      "default-src * self blob: data: gap:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap:; object-src * 'self' blob: data: gap:; img-src * self 'unsafe-inline' blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;"
    )
    .render("restaurantcard", {
      restaurants,
    });
});

exports.filter = catchAsync(async (req, res, next) => {
  try {
    let cost = req.query.cost;
    const cuisine = req.body.params.Cuisine;
    const Sort = req.body.params.sort;
    let paramobj = {};
    if (cuisine) {
      paramobj.Cuisine = cuisine;
    }
    if (Sort) {
      paramobj.sort = Sort;
    }
    if (!cost) {
      cost = "";
    } else {
      cost = `?${cost}`;
    }
    const data = await axios.get(
      `http://localhost:3000/api/ver1/restaurant${cost}`,
      {
        params: paramobj,
      }
    );
    const restaurantinloc=data.data.data
      res
        .status(200)
        .json(restaurantinloc)
    // .json(restaurantinloc);
  } catch (err) {
    console.log(err);
  }
});
exports.filterdata = catchAsync(async (req, res, next) => {
  res
    .status(200)
    .set(
      "Content-Security-Policy",
      "default-src * self blob: data: gap:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap:; object-src * 'self' blob: data: gap:; img-src * self 'unsafe-inline' blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;"
    )
    .render("restaurantcard", {
      restaurantinloc,
    });
  //  res.render('restaurantcard',{restaurantinloc:restaurantinloc})
  //  res.render('restaurantcard',{restaurantinloc:restaurantinloc})
});
