import axios from "axios";
import express = require("express");
import { WeatherData } from "../interfaces/weather-data";
import { WeatherStation } from "../main";

export class WeatherAPIService {
    public weatherData: WeatherData;

    constructor(private weatherStation: WeatherStation) {
        // get data every 60 Seconds
        setInterval(this.getWeatherData.bind(this), 60 * 1000);

        this.getWeatherData();
    }

    private async getWeatherData(): Promise<void> {
        const boxID = "61a4e1ac4a7833001b7d81d8";
        const sensebox_api_url = `https://api.opensensemap.org/boxes/${boxID}`;
        const senseboxData: WeatherData = await (
            await axios.get(sensebox_api_url)
        ).data;
        if (senseboxData !== undefined) {
            this.weatherData = senseboxData;
            this.insertWeatherData();
        }
    }

    private async insertWeatherData(): Promise<void> {
        return;
    }
}
