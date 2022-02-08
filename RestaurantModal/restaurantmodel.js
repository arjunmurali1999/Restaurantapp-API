const mongoose = require("mongoose");
const slugify = require("slugify");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "The Restaurant must have a name"],
    unique: true,
    trim: true,
    minlength: [
      4,
      "the Restaurant name should be of minimum 4 characters long",
    ],
    maxlength: [
      40,
      "the Restaurant name should be of maximum 4 characters long",
    ],
  },
  id: String,
  slug: String,
  city_name: {
    type: String,
    required: [true, "The Restaurant must have a city"],
  },
  city: {
    type: String,
  },
  area: {
    type: String,
  },
  locality: {
    type: String,
    required: [true, "The Restaurant must have a  address"],
    trim: true,
  },
  thumb: {
    type: String,
    reqiured: [true, "The Restaurant should have a thumbnail picture"],
  },
  cost: {
    type: String,
    required: [true, "The cost should be specified"],
  },
  address: {
    type: String,
    required: [true, "The Restaurant must have an address"],
    trim: true,
  },
  type: [
    {
      mealtype: String,
      name: String,
    },
    {
      mealtype: String,
      name: String,
    },
  ],
  Cuisine: [
    {
      cuisine: String,
      name: String,
    },
    {
      cuisine: String,
      name: String,
    },
  ],
  secretRestaurant: {
    type: String,
    default: false,
  },
});
//1 DOCUMENT MIDDLEWARE
restaurantSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true }); //this refers to objects present inside the schema
  next();
});

// QUERY MIDDLEWARE
restaurantSchema.pre(/^find/, function (next) {
  this.find({ secretRestaurant: { $ne: true } });
  next();
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
