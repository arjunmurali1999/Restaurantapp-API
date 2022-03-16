const catchasync = require("./catchasync");
const apiFeatures = require("./../apiFeatures/apiFeatures");
const AppError = require("./../apiFeatures/appError");

exports.deleteOne = (Model) =>
  catchasync(async (req, res, next) => {
    const deleteddoc = await Model.findOneAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      message: "the data is deleted",
    });
  });

exports.updateOne = (Model) =>
  catchasync(async (req, res, next) => {
    const updateddoc = await Model.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      updateddoc: updateddoc,
    });
  });

exports.createOne = (Model) =>
  catchasync(async (req, res, next) => {
    const newdoc = await Model.create(req.body);
    res.status(200).json({
      status: "success",
      newdoc: newdoc,
    });
  });

exports.getOne = (Model) =>
  catchasync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (doc === null) {
      return next(new AppError(`no data found with that id`, 404));
    }
    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.getall = (Model) =>
  catchasync(async (req, res, next) => {
    if (Object.keys(req.query).includes("Cuisine")) {
      const features = new apiFeatures(Model.find(), req.query)
        .filterarray()
        .sort()
        .limitFields()
        .paginate();
      const doc = await features.query;
      res.header("Access-Control-Allow-Origin", "*").status(200).json(doc);
    } else {
      const features = new apiFeatures(Model.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      const doc = await features.query;
      res.header("Access-Control-Allow-Origin", "*").status(200).json(doc);
    }
  });
