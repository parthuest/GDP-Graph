const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const JSON = require("circular-json")
const apiUrl =
    "http://api.worldbank.org/countries/USA/indicators/NY.GDP.MKTP.CD?per_page=5000&format=json";

//use cors to allow cross origin resource sharing
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());

//Allow Access Control
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT,DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    res.setHeader("Cache-Control", "no-cache");
    next();
});

app.get("/api/graph", async (req, res, next) => {
    console.log("/api/graph");
    try {
        const result = await axios.get(apiUrl);
        let resData = result.data[1].map(element => {
            return {
                val: element.value ? element.value / 100000000000 : 0,
                year: element.date
            };
        });
        res.status(200).send(resData);
    } catch (error) {
        next(error);
    }
});

app.use(function(err, req, res, next) {
    console.log(err)
    res.status(422).send(JSON.stringify(err));
});

module.exports = app;

//start your server on port 5000
app.listen(5000);
console.log("Server Listening on port 5000");
