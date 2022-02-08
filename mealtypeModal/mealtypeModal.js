const mongoose = require('mongoose')
 const mealtypeSchema=mongoose.Schema({
     name:{
         type:String,
         required:true
     },
     content:{
         type:String,
         required:true
     },
     image:{
         type:String,
         required:true
     }
 })
 const mealType=mongoose.model('mealType',mealtypeSchema)
 module.exports=mealType