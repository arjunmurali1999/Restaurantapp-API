const AppError = require('./../apiFeatures/appError');

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrProd = (err, res) => {
  
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //1)log error
    // eslint-disable-next-line no-console
    //2)Send generate error
    res.status(500).json({
      status: "error",
      message: "Please fill all the  fields",
    });
  }
};
const handlecasterror = (err) => {
  const message = `Invalid ${err.path} :${err.value}`;
  return new AppError(message, 400);
};
const handleduplicateerror = (err) => {
  const key = Object.keys(err.keyValue).join("");
  const message = `The  ${key} has already been registered`;
  return new AppError(message, 400);
};

module.exports= (err,req,res,next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV == "development") {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (err.name === "CastError") {
      error = handlecasterror(err);
    }
    if (err.code == 11000) {
      error = handleduplicateerror(err);
    }
    sendErrProd(error, res);
  }
};

