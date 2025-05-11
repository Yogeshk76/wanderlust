const express=require("express");
const router=express.Router();
const User= require("../models/user.js")
const wrapAsync=require("../utils/wrapasync.js")
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");


//signup route
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
});

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newUser = new User({ email, username});
        const registeredUser= await User.register(newUser,password);
        req.login(registeredUser,(e)=>{
            if(e){
                next(e);
            };
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listing");
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }
    
}));


//login route
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});


router.post("/login",saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
    req.flash("success","Welcome to Wanderlust! You are logged in");
    let redirectUrl=res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
});


//logout route
router.get("/logout",(req,res)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        };
        req.flash("success","You are logged out!");
        res.redirect("/login");
    });
});

module.exports=router;