const express = require("express");
const cors = require("cors");
const path = require("path");

const router = express.Router();
router.use(cors());

router.get("/index.html", (req, res, next) => {
  res.set({ "Content-Type": "text/html" });
  res.set({ "Access-Control-Allow-Origin": "http://localhost:3000" });
  next();
});

router.get("/data.json", (req, res, next) => {
  res.set({ "Content-Type": "application/json" });
  res.set({ "Access-Control-Allow-Origin": "*" });
  next();
});

module.exports = router;
