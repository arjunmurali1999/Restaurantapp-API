const User = require("./../userModal/userModal");
const factory = require("./factorycontroller");


exports.getalluser = factory.getall(User);
exports.getuser = factory.getOne(User);
exports.updateuser = factory.updateOne(User);
exports.deleteuser = factory.deleteOne(User);


