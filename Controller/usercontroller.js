const User = require("./../userModal/userModal");
const factory = require("./factorycontroller");
const catchasync = require("./catchasync");

exports.getalluser = factory.getall(User);
exports.updateuser = factory.updateOne(User);
exports.deleteuser = factory.deleteOne(User);

exports.getuser =catchasync(async (req, res) => {
    const doc = await User.findById(req.user.id);
    if (doc === null) {
      return next(new AppError(`no user found with this id`, 404));
    }
    res.status(200).json({
      status: "success",
      data: doc,
    })
})
