const express=require("express")
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("../schema.js")
const Review = require("../models/review")
const Listing = require("../models/listing")
const { isLoggedIn, isOwner,validateReview, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");
// validate function 



// reviews
// post route -> review humesha listings ke saath hi aayega

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))

// delete review route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview))

module.exports=router;