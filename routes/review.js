const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapasync.js")
const ExpressError=require("../utils/expresserror.js")
const {reviewSchema}=require("../schema.js")
const Review =require("../models/review.js")
const Listing=require("../models/listing.js")

//Reviews
router.post("/",wrapAsync (async (req,res)=>{
    let listing= await Listing.findById(req.params.id)
    const newReview = new Review({
        comment: req.body.review.comment,
        rating: req.body.review.rating,
        reviewer: req.user._id 
    });
    listing.reviews.push(newReview)

    await newReview.save();
    await listing.save();

    req.flash("success","New review added")
    res.redirect(`/listing/${listing._id}`)
}))

//delete review route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"reviewer"}}).populate("owner");
     // Check if the listing exists
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("back");
    }

    // Find the review to delete
    const reviewToDelete = listing.reviews.find(review => review._id.equals(reviewId));

    // Check if the review exists
    if (!reviewToDelete) {
        req.flash("error", "Review not found");
        return res.redirect("back");
    }

    // Check if the current user is the owner of the review
    if (!reviewToDelete.reviewer._id.equals(req.user._id)) {
        req.flash("error", "This is not your review");
        return res.redirect("back");
    }
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","Review Deleted")
    res.redirect(`/listing/${id}`)
}))

module.exports=router;