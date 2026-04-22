const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("dns");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

dns.setServers(["1.1.1.1", "1.0.0.1"]);
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// ✅ CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "https://webnantea-3b49.vercel.app"],
    credentials: true,
  }),
);

// 🔥 FIX QUAN TRỌNG NHẤT (UPLOAD ẢNH LỚN)
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));

app.use(cookieParser());

// ✅ routes
routes(app);

// ✅ DB
mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.error("❌ Error connecting to MongoDB:", error);
  });

// ✅ error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err.stack);
  res.status(500).json({
    status: "ERROR",
    message: "Something went wrong",
  });
});

// ✅ server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
