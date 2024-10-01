const express = require("express");
const staticRoutes = require("./routes/staticRoutes");
const app = express();

app.use("/static", staticRoutes);

app.use("/static", express.static("public"));

app.get("/", (req, res) => {
  res.set({ "Content-Type": "text/html" });
  res.send("Hi");
});

app.listen(3000);
