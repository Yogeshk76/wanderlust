const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const methodoverride=require("method-override")
const ejsmate = require("ejs-mate")
const ExpressError=require("./utils/expresserror.js")
const listing=require("./routes/listing.js")
const reviews=require("./routes/review.js")
const user=require("./routes/user.js")
const session = require("express-session")
const flash= require("connect-flash")
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user");
require('dotenv').config()




async function main(){
    await mongoose.connect(process.env.DB_HOST)
};
main().then(()=>{
    console.log("connected to database")
}).catch((err)=>{
    console.log(err)
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs",ejsmate);

const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    }
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
}
);


app.use("/listing",listing)
app.use("/listing/:id/reviews",reviews)
app.use("/",user)
app.get('/',(req,res)=>{
    res.redirect('/listing')
})



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong!' } = err;
    // Extract the last line of the error message
    const lastLine = message.split('\n').pop();
    console.log(message)
    res.status(statusCode);
    res.render('error.ejs', { err: { message: lastLine, statusCode } });
});


app.listen(process.env.PORT,()=>{
    console.log("server is started")
})
