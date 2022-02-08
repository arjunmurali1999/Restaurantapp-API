const catchasync = (fn) => (err, req, next) => {
  fn(err, req, next).catch((err) =>next(err));
};
module.exports = catchasync;
