const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const User = require("../models/user.js");
const { router } = require("../routes/user.js");

// sign-up route

module.exports.signupForm = (req, res) => {
    res.render("users/signup.ejs")
}

// create user 

module.exports.signupUser = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({
            email, username
        })
        const registeredUser = await User.register(newUser, password)
        console.log(registeredUser)
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "new user registered")
            res.redirect("/listings")
        })

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("user/signup")
    }

}

// login route 

module.exports.loginForm = (req, res) => {
    res.render("users/login.ejs")
}

// login user logic

module.exports.loginUser = async (req, res) => {
    req.flash("success", "welcome to wanderLust")
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}

// logout route 

module.exports.logoutUser = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out");
        res.redirect("/listings");
    });
}