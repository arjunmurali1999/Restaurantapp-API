const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validator: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not same",
    },
  },
  role: {
    type: String,
    enum: ["admin", "Developer","user"],
    default: "user",
  },
  passwordChangedAt: {
    type: Date,
    timestamps: true,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  Active: {
    type: Boolean,
    select: false,
    default: true,
  },
  address:{
    type:String,
  },
  sessioninfo:{}
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.methods.correctpassword = async function (
  candidatepassword,
  userpassword
) {
  return await bcrypt.compare(candidatepassword, userpassword);
};
userSchema.methods.changepassword = function (JWTtimestamp) {
  if (this.passwordChangedAt) {
    const changedtimestamp = parseInt(this.passwordChangedAt.getTime() / 1000);
    console.log(changedtimestamp, JWTtimestamp);
    return JWTtimestamp < changedtimestamp ? true : false;
  }
  return false;
};

userSchema.methods.createpasswordresettoken = function () {
  const resettoken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resettoken)
    .digest("hex");
  console.log({ resettoken: resettoken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resettoken;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
