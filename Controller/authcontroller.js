const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../userModal/userModal");
const catchasync = require("./catchasync");
const AppError = require("./../apiFeatures/appError");
const sendEmail = require("./../utils/email");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createsendToken = (user, statuscode, res) => {
  const token = signToken(user._id);
  const cookieoptions = {
    //res.cookie()accepts 3 values name,data to be passed through cookie and also other options
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieoptions);
  if (process.env.NODE_ENV === "production") cookieoptions.secure = true;
  //remove the password from output
  user.password = undefined;
  res.status(statuscode).json({
    status: "success",
    token: token,
    data: {
      user: user,
    },
  });
};

exports.signup = catchasync(async (req, res, next) => {
  if (req.body.role === "Developer" || req.body.role === "admin") {
    return next(
      new AppError(
        "You cannot sign in as Developer or Admin !Please sign in as user",
        401
      )
    );
  }
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordchangedAt,
    role: req.body.role,
  });
  createsendToken(newUser, 201, res);
});
exports.signupdev = catchasync(async (req, res, next) => {
  if (req.body.role === "user") {
    return next(
      new AppError(
        "You cannot sign in as user in this route !Please sign in as Developer",
        401
      )
    );
  }
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordchangedAt,
    role: req.body.role,
  });
  createsendToken(newUser, 201, res);
});
exports.login = catchasync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 401));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctpassword(password, user.password))) {
    return next(new AppError("Please check your email or passsword", 401)); //401 bad authentication
  }
  createsendToken(user, 200, res);
});

exports.protect = catchasync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError("You are not logged in Please login to get access", 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists", 401)
    );
  }
  if (currentUser.changepassword(decoded.iat) == true) {
    return next(
      new AppError("Your password changed recently !Please login again", 401)
    );
  }
  req.user = currentUser;
  next();
});
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You are not Authorized to perform this action", 403)
      ); //403 not authorized
    }
    next();
  };
exports.forgotpassword = catchasync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with this email address "));
  }
  const resetToken = user.createpasswordresettoken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetpassword/${resetToken}`;
  const message = `Forgot your password Submit a patch request with your new password and passwordConfirm to ${resetURL}.\n if you didnt forget your password please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: "your token is valid for only 10 mins",
      message: message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was error in sending email please try again later",
        500
      )
    );
  }
});
exports.resetpassword = catchasync(async (req, res, next) => {
  const hashedtoken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedtoken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("Token is invalid or expired", 401));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createsendToken(user, 201, res);
});
exports.updatepassword = catchasync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (
    !user ||
    !(await user.correctpassword(req.body.passwordCurrent, user.password))
  ) {
    return next(new AppError("please type the correct password", 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  createsendToken(user, 200, res);
});

exports.google_login = async (req, res, next) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  });
  const { name, email, email_verified } = ticket.payload;
  if (email_verified) {
    try {
      const user = await User.findOne({ email: email });
      if (user) {
        createsendToken(user, 200, res);
      } else {
        let password = email + Math.floor(Math.random() * 1000);
        const newUser = await User.create({
          name,
          email,
          password,
          passwordConfirm: password,
        });
        createsendToken(newUser, 201, res);
      }
    } catch (err) {
      return res.status(400).json({ error: "Something went wrong ..." });
    }
  }
};
