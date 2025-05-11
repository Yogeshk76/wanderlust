const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapasync.js")
const ExpressError=require("../utils/expresserror.js")
const {listingSchema}=require("../schema.js")
const Listing=require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js");



//search route
router.get("/search",async (req,res)=>{
    let query =req.query.query
    const listings= await Listing.find({ "features": { $regex: `${query}`, $options: "i" } })
    res.render("listings/search.ejs",{listings})
})



//all listings
router.get("/",async (req,res)=>{
    const allListings = await Listing.find({})
    res.render("listings/index.ejs",{allListings})
})

//New route 
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs")
});


//create route
router.post("/",isLoggedIn, wrapAsync(async (req, res) => {

    let listing= req.body.listing;
    const newListing =  new Listing(listing);
    newListing.owner = req.user._id; 
    await newListing.save();

    req.flash("success", "New listing created!");
    res.redirect(`/listing`);
}));

//show route
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"reviewer"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist!")
        return res.redirect("/listing")
    }
    res.render("listings/show.ejs", { listing, user: req.user });
}));


//edit route
router.get("/:id/edit",isLoggedIn, wrapAsync(async (req,res)=>{
    let id=req.params.id
    let listing =await Listing.findById(id)
    if(!listing){
        req.flash("error","Listing does not exist!")
        return res.redirect("/listing")
    }
    if (!listing.owner._id.equals(req.user._id)) {
        req.flash("error", "You don't have permission to Edit");
        return res.redirect(`/listing/${id}`);
    }
    res.render("listings/edit.ejs",{listing})
}));


//update route
router.put("/:id", wrapAsync(async (req,res)=>{
    let id=req.params.id
    const listing = await Listing.findById(id).populate("owner");
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listing");
    }

    if (!listing.owner._id.equals(req.user._id)) {
        req.flash("error", "You don't have permission to Edit");
        return res.redirect(`/listing/${id}`);
    }
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
        req.flash("success","Listing Updated")
        res.redirect(`/listing/${id}`)
}))




//delete route
router.delete("/:id/delete",isLoggedIn,async (req,res)=>{  
    let{id}=req.params
    const listing = await Listing.findById(id).populate("owner");
    if (!listing.owner._id.equals(req.user._id)) {
        req.flash("error", "You don't own this listing");
        return res.redirect(`/listing/${id}`);
    } else {
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing Deleted");
        return res.redirect("/listing");
    }
})


module.exports=router;
