// store callbacks

const Listing=require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const baseClient = mbxGeocoding({ accessToken: mapToken });

// index route -> to display all listings

module.exports.index=async(req,res)=>{
    // get all data from database
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}

// new route -> to display a form to create new listing

module.exports.renderNewForm=(req, res) => {
    res.render('listings/new.ejs')
}

// show route -> to display a single listing

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author",
    }}).populate("owner"); // har ek listiing ke liye author
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    // console.log(listing)
    res.render("./listings/show.ejs", { listing });

}

// create route -> to create a new listing

module.exports.createListing=async (req, res, next) => {

    let response = await baseClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
      })
        .send()
    
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,'..',filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id; // to store the owner info
    newListing.image={url,filename}
    
    newListing.geometry=response.body.features[0].geometry; // to store the geometry info
    let savedListing=await newListing.save();
    console.log(savedListing)
    req.flash("success","New Listing Created")
    res.redirect("/listings");
}

// edit route -> to display a form to edit a listing

module.exports.editListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
    res.render("./listings/edit.ejs", { listing,originalImageUrl });
    }

// update route -> to update a listing

module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== 'undefined'){
        let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename}
    await listing.save();
    }
    
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`)
    }

// delete route -> to delete a listing

module.exports.deleteListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing)
    req.flash("success","Listing Deleted")
    res.redirect("/listings");
    }

// search route -> to search for listings

module.exports.searchListing=async(req,res)=>{
    let countryName=req.body.search;
    let allListings=await Listing.find({country:countryName})
    if(allListings && allListings.length > 0){
        res.render("./listings/search.ejs",{allListings})
    }
    else{
        req.flash("error","No listings found");
        res.redirect("/listings");
        }
    
}
