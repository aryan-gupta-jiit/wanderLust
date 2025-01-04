const mongoose=require("mongoose");
const { Schema } = mongoose;
const initData=require("./data");
const Listing=require("../models/listing");

const MONGO_URL = "mongodb://localhost:27017/wanderlust";

main().then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL)
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
        ...obj,
        owner:"676eaef47415dd42f67aa7b4",
    }))
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
}

initDB();