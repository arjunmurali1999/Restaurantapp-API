const Stripe = require("stripe");
const stripe = Stripe(
  process.env.STRIPE_SECRET_KEY
);
const queryString = require("query-string");
const User = require("../userModal/userModal");
const Restaurant = require("../RestaurantModal/restaurantmodel");
const Booking = require("../bookingModal/bookingModal");
const catchAsync = require("./catchasync");
const factory = require("./factorycontroller");
const Menu = require("../menuModal/menuModal");

exports.Checkoutsession = catchAsync(async (req, res, next) => {
  try {
    const { amount, dishes, id } = req.body;
    const orderdetails = dishes.map((item) => {
      return {
        quantity: item.quantity,
        amount: item.amount,
        name: item.name,
      };
    });
    let order = orderdetails.map((order) => {
      return queryString.stringify(order, { arrayFormat: "index" });
    });
    order = order.join("&");
    const session = await stripe.checkout.sessions.create({
      line_items: dishes,
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: req.user.email,
      shipping_address_collection: { allowed_countries: ["US", "IN"] },
      success_url: `http://localhost:3000/success?${order}?${id}`, ///?items=${dishes}&id=${id}&user=${req.user.id}
      cancel_url: `http://localhost:3000/Restaurant/Name/${id}`,
    });
    await User.findByIdAndUpdate(req.user.id, { sessioninfo: session });
    res.status(200).json({ status: "success", session });
  } catch (err) {
    console.log(err);
  }
});
exports.createOrderDetails = catchAsync(async (req, res) => {
  const { order, id, email } = req.body;
  const user = await User.find({ email: email });
  const session = await stripe.checkout.sessions.retrieve(
    user[0].sessioninfo.id
  );
  const address = session.shipping.address;
  const restaurant = await Restaurant.find({ id: id });
  if (session.payment_status === "paid") {
    const OrderExist = await Booking.findOne({ session_id: session.id });
    if (OrderExist) {
      res.json("Already order was taken");
    } else {
      try {
        await Booking.create({
          session_id: session.id,
          user: user[0]._id,
          email,
          address,
          orderdetail: order,
          restaurant: restaurant[0]._id,
          restaurantname: restaurant[0].name,
          restaurantaddress:restaurant[0].address,
          image:restaurant[0].thumb,
          restaurantId:id,
          placedat:new Date().toLocaleString('en-US', {timeZone: 'Asia/Kolkata'})
        });
        await User.findByIdAndUpdate(user[0]._id,{$set:{sessioninfo:{}}})
        res.status(200).json("Order received");
      } catch (err) {
        console.log(err);
      }
    }
  }
});
exports.getOrderDetails=catchAsync(async(req,res)=>{
  const {email}=req.query
  const orderdetails=await Booking.find({email: email},null,{sort:{placedat:-1}})
  res.status(200).json(orderdetails)
})
