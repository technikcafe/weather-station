import express = require("express");
import axios from "axios";
import { WeatherAPI } from "./weather-api";

const app = express();

app.use(express.static("./web/dist/"));
app.get("/", (request: express.Request, response: express.Response) => {
    response.sendFile("./web/dist/index.html");
});

new WeatherAPI(app);

app.listen(4340, () => {
    console.log("started server");
});
