const mongoose = require('mongoose')
const menuSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    ingredients:{
        type:[String],
        required:true,
    },
    restaurantId:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true, 
    },
    qty:{
        type:Number,
        required:true,
    },
    price:{
        type:Number,
        required:true,  
    }
})
const Menu=mongoose.model('Menu',menuSchema)
module.exports=Menu