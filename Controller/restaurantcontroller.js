const Restaurant = require("./../RestaurantModal/restaurantmodel");
const catchasync = require("./catchasync");
const factory = require("./factorycontroller");

exports.topcheap = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "cost";
  req.query.fields = "name,city_name,locality,cost,address,Cuisine";
  next();
};
exports.getallrestaurants = factory.getall(Restaurant);
exports.getrestaurants = factory.getOne(Restaurant);
exports.createrestaurant = factory.createOne(Restaurant);
exports.updateRestaurant = factory.updateOne(Restaurant);
exports.deleteRestaurant = factory.deleteOne(Restaurant);
exports.getrestaurantonid = catchasync(async (req, res, next) => {
  const doc = await Restaurant.find({ id: req.params.id });
  if (doc === null) {
    return next(new AppError(`no data found with that id`, 404));
  }
  res.header("Access-Control-Allow-Origin", "*").status(200).json(doc);
});

exports.getRestaurantStats = catchasync(async (req, res) => {
  const stats = await Restaurant.aggregate([
    {
      $match: {},
    },
    {
      $group: {
        //   RestaurantName: "$name",
        _id: "$cost",
        count: { $sum: 1 },
        // avgcost: { $avg: "$cost" },
      },
    },
    {
      $sort: { _id: 1 },
    },
    //   {
    //     sort: { avgcost: 1 },
    //   },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});
