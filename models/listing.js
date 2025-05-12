const mongoose= require("mongoose");
const schema=mongoose.Schema;
const Review =require("./review.js")

const listingSchema= new schema({
    title:String,
    description:String,
    image:String,
    price:Number,
    location:String,
    country:String,
    features:String,
    reviews:[
        {
            type: schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:schema.Types.ObjectId,
        ref:"User"
    }
})

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
    await Review.deleteMany({_id: {$in:listing.reviews}})
    }
})

const Listing=mongoose.model("Listing",listingSchema)
module.exports =Listing;