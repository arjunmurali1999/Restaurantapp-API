const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost", //acessing the data using this route
  })
);

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database successfully connected");
  });

const port = 3002;
app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
