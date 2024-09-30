const express = require("express");
const app = express();

app.use('/static', express.static('public'));

app.get("/", (req, res) => {
    res.set({'Content-Type': 'text/html'});
    res.send("Hi");
});

app.get("/static", (req, res) =>{
    
})

app.listen(3000);