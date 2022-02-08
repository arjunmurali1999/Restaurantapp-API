const mongoose =require('mongoose');
const bookingSchema=mongoose.Schema({
    session_id:{
       type:String
    },
    user:{
        type:mongoose.Schema.ObjectId,
        required:[true,'the order should belong to a user'],
        ref:"User"
    },
    email:{
        type:String,
    },
    address:{
        type:Object,
    },
    orderdetail:{
        type:Object,
        required:true
    },
    restaurant:{
        type:mongoose.Schema.ObjectId,
        required:[true,'the oder should belong to a restaurant'],
        ref:"Restaurant"
    },
    restaurantname:{
        type:String,
    },
    image:{
        type:String
    },
    restaurantaddress:{
        type:String
    },
    restaurantId:{
        type:Number
    },
    placedat:{
       type:Object,
    }
})
const Booking=mongoose.model('Booking',bookingSchema)
module.exports=Booking