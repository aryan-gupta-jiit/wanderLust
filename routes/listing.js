const express = require("express");
const router = express.Router();
exports.router = router;
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("../schema.js")
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings");

const { storage } = require('../cloudConfig.js');
const multer = require('multer');
const upload = multer({ storage });


router
    .route("/")
    // show all listings
    .get(wrapAsync(listingController.index))
    // create route
    .post(isLoggedIn,
        upload.single("listing[image]"),
        wrapAsync(listingController.createListing))

// new route

router.get("/new", isLoggedIn, listingController.renderNewForm)

router
    .route("/:id")
    // show route
    .get(wrapAsync(listingController.showListing))
    // update route
    .put(isLoggedIn,isOwner,upload.single("listing[image]"), wrapAsync(listingController.updateListing))
    // delete route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))

// Edit Route 

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing))

module.exports = router;