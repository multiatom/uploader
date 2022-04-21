"use strict";

var express = require("express");

var path = require("path");
var morgan = require("morgan");
var bodyParser = require("body-parser");

var index = require("./routes/index/index.js").router;
var http = require("http");
//var https = require("https");

var fs = require("fs");

var app = express().enable("strict routing").disable("etag").disable("x-powered-by");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.disable("view cache");

app.use(morgan("dev"));

app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: false}));



app.use(express.static(path.join(__dirname, "public")));


app.use("/$", index);


http.createServer(app).listen(80, function() {

    console.log("Express server listening on port 80");

});