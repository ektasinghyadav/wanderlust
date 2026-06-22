const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");

router.get("/register", userController.renderRegisterForm);
router.post("/register", wrapAsync(userController.register));

router.get("/login", userController.renderLoginForm);
router.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: "Invalid username or password. Please try again.",
}), userController.login);

router.get("/logout", userController.logout);

router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  userController.googleCallback
);

module.exports = router;
