"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const weather_api_1 = require("./weather-api");
const app = express();
app.use(express.static("./web/dist/"));
app.get("/", (request, response) => {
    response.sendFile("./web/dist/index.html");
});
new weather_api_1.WeatherAPI(app);
app.listen(4340, () => {
    console.log("started server");
});
