const express = require("express");
const router = express.Router();
exports.router = router;
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("../schema.js")
const Listing = require("../models/listing");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

router
    .route("/signup")
    // render signup form
    .get(userController.signupForm)
    // handle signup logic
    .post(wrapAsync(userController.signupUser));

router
    .route("/login")
    // render login 
    .get(userController.loginForm)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.loginUser)
// authenticate middleware for login authentication

router.get("/logout", userController.logoutUser)

module.exports = router;