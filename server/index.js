const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const productRoutes = require("./routes/product");
const usersRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const serviceRoutes = require("./routes/service");
const cartRoutes = require("./routes/cart");
const orderRouters = require("./routes/order");
const cronJob = require("./routes/cron");

dotenv.config();
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const PORT = process.env.PORT || 3000;

// MongoDB connection
console.log(process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,

  useUnifiedTopology: true,
  ssl: true,
  sslValidate: false, // Set sslValidate to false to bypass certificate validation
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});
// Middleware
app.use(bodyParser.json());

// Routes
app.use(productRoutes);
app.use(usersRoutes);
app.use(categoryRoutes);
app.use(cartRoutes);
app.use(serviceRoutes);
app.use(orderRouters);

cronJob.start();

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
