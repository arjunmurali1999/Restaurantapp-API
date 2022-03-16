const express = require("express");
const router = express.Router();
const authController = require("./../controller/authcontroller");
const userController = require("./../controller/usercontroller");
const bookingController = require("./../controller/bookingController")
router.route("/checkout").post(authController.protect,bookingController.Checkoutsession)
router.route("/signup").post(authController.signup);
router.route("/signup/dev").post(authController.signupdev);
router.route("/login").post(authController.login);
router.route("/google-login").post(authController.google_login)
router.route("/forgotpassword").post(authController.forgotpassword);
router.route("/resetpassword/:token").patch(authController.resetpassword);
router
  .route("/updatepassword")
  .patch(authController.protect, authController.updatepassword);

router.route("/user").get(authController.protect, userController.getuser);
router
  .route("/")
  .put(authController.protect,userController.updateuser)

router.use(
  authController.protect,
  authController.restrictTo("Developer", "admin")
);
router.route("/").get(userController.getalluser);
router
  .route("/:id")
  .delete(userController.deleteuser);

module.exports = router;
