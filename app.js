require('dotenv').config()
const dbUrl=process.env.ATLASDB_URL

const express = require("express")
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")
const {listingSchema,reviewSchema}=require("./schema.js")
const Review = require("./models/review")
const router=express.Router();

const reviewsRouter=require("./routes/review.js")
const listingsRouter=require("./routes/listing.js")
const userRouter=require("./routes/user.js")

const session=require("express-session")
const MongoStore=require("connect-mongo")
const flash = require("connect-flash");
const passport=require("passport")
const localStrategy=require("passport-local")
const User = require("./models/user");



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method")) // for update and delete methods 
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

const store= MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
    })

store.on("error",()=>{
    console.log("error in mongo session store",err)
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*100, // in milliseconds
        maxage:7*24*60*60*1000,
        httpOnly:true,
    }
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate())); // login signup ke liye authenticate maethod use krenge

passport.serializeUser(User.serializeUser()); // user le information ko session mien store karwana
passport.deserializeUser(User.deserializeUser()); // user ke information ko session se hatana


// connecting to database


main().then(() => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
})

async function main() {
    mongoose.connect(dbUrl)
}

// flash middleware

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.use("/listings",listingsRouter);

// review Route

app.use("/listings/:id/reviews",reviewsRouter)

// user Route

app.use("/",userRouter)



// error handling

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"))
})

app.use((err, req, res, next) => {
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message})
})

app.listen(8080, () => {
    console.log("server is listening to port 8080");
})