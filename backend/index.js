const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require('./config/db.js');
const chatRouter = require('./routes/ChatRoute.js');

const app = express();
app.use(cors());
app.use(express.json())
connectDB();

app.use("/chat", chatRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("server is running on port http://localhost:8080");
})