const Menu =require("../menuModal/menuModal")
const factory=require("./factorycontroller")

exports.getallmenu=async(req,res,next)=>{
    const id=req.query.id
    const menu=await Menu.find({restaurantId:id})
    res.status(200).json(menu)
}