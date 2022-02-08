const express = require("express");
const path= require("path")
const rateLimit = require("express-rate-limit");
// const bodyparser = require("body-parser");
const AppError = require("./apiFeatures/appError");
const restaurantroute = require("./Routes/restaurantroute");
const userroute = require("./Routes/userroute");
const bookingroute=require("./Routes/BookingRoute")
const mealtype=require("./import-data/mealtype")
const cookieParser=require('cookie-parser')
const session=require("express-session");
const viewroute=require("./views/viewroute")
const errorhandler = require("./controller/errorcontroller");
const helmet = require("helmet");
const mongosanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");
const hpp = require("hpp");
const app = express();
const bodyParser=require("body-parser");
//GLOBAL MIDDLEWARE
//1)Set security HTTP Headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'http:', 'data:'],
      scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
    },
  })
);
app.use(cors())
// app.use(bodyparser.json());
app.set('view engine', 'pug')
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')))//CSS file is in public fiolder so it is used in path.join to get that folder
app.use(helmet());



//Limit requests from the same API
// const limiter = rateLimit({
//   //with express rate limit package the brute force attack is not possible
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   standardHeaders: true,
//   message: "Too many request from this IP,please try again in an hour",
// });
// app.use("/api", limiter); //app.use() is used for all middleware functions

//Body parser,reading data from the req.body
app.use(express.urlencoded({extended: true,limit: "10kb" }));
app.use(express.json());
app.use(cookieParser()); 
app.use((req,res,next)=>{
  const obj = JSON.parse(JSON.stringify(req.cookies));
 next();
})
//Data sanitization against noSQL query injection
app.use(mongosanitize());
app.use(session({secret: 'ssshhhhh'}));
//data sanitization against html
app.use(xss());
// app.use(function (req, res, next) {
//   res.locals.restaurantinloc = req.session.data;
//   next();
// });
//Prevent parameter pollution (removes the duplicates in the parameters)
app.use(hpp());
app.use("/api/ver1/restaurant", restaurantroute);
app.use("/api/ver1/users", userroute);

app.use("/Restaurant",bookingroute)
// app.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
//   const event = request.body;
//   // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntent = event.data.object;
//       // console.log(paymentIntent.charges.data)
//       console.log('PaymentIntent was successful!');
//       break;
//     case 'payment_method.attached':
//       const paymentMethod = event.data.object;
//       break;
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }
//   response.json({received: true});
// });
app.get('/mealtypes',(req,res)=>{
  res.header('Access-Control-Allow-Origin', '*');
  res.json(mealtype)
  })
  app.use("/",viewroute);
app.all("*", (req, res, next) => {
  next(new AppError(`Cant find the ${req.originalUrl} on this server`, 404));
});
app.use(errorhandler);
module.exports = app;
