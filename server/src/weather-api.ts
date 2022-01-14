import axios from "axios";
import express = require("express");
import { WeatherData } from "./interfaces/weather-data";

export class WeatherAPI {
    private weatherData: WeatherData;

    constructor(private app: express.Application) {
        this.initAPIRequests();
        setInterval(this.getWeatherData.bind(this), 120 * 1000);
        this.getWeatherData();
    }

    private initAPIRequests() {
        this.app.get(
            "/api/weather",
            async (request: express.Request, response: express.Response) => {
                response.json(this.weatherData);
            }
        );
    }

    private async getWeatherData() {
        const boxID = "61a4e1ac4a7833001b7d81d8";
        const sensebox_api_url = `https://api.opensensemap.org/boxes/${boxID}`;
        const senseboxData: WeatherData = await (
            await axios.get(sensebox_api_url)
        ).data;
        if (senseboxData !== undefined) {
            this.weatherData = senseboxData;
        }
    }
}
