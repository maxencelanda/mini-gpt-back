require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { websocket } = require("./websocket");
const connectDB = require("./db");

connectDB();
const app = express();
app.use(cors());
const server = http.createServer(app);
websocket(server);

server.listen(3006, () => {
  console.log('Server running on http://localhost:3006');
});
