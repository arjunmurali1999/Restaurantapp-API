const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./../userModal/userModal");
const Restaurant = require("./../RestaurantModal/restaurantmodel");
const mealType=require('./../mealtypeModal/mealtypeModal')
const Menu=require('../menuModal/menuModal')
dotenv.config({ path: "./config.env" }); // remember the config file should be in same file as tthat of server so only relative path
// should be mentioned in the path
const DB = process.env.DATABASE;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  })
  .then(() => {
    console.log("DatabaseConnected");
  });

const restaurant = JSON.parse(
  fs.readFileSync(`${__dirname}/restaurantdata.json`, "utf-8")
);
const user = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
 
const mealtype=JSON.parse(fs.readFileSync(`${__dirname}/mealtype.json`,"utf-8"))

const menu =JSON.parse(fs.readFileSync(`${__dirname}/menu.json`,"utf-8"))

const importData = async () => {
  try {
    await Restaurant.create(restaurant); //.create() will import the data from file to database
    await User.create(user,{validateBeforeSave:false});
    await mealType.create(mealtype)
    await Menu.create(menu);
    console.log("Data successfully imported");
  } catch (err) {
    console.log(err.message);
  }
  process.exit(); //Exits the process
};

const deletedata = async () => {
  try {
    //.deleteMany() will delete the data from the database
    await User.deleteMany();
    await mealType.deleteMany();
    await Menu.deleteMany();

    console.log("Data successfully deleted");
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deletedata();
}
