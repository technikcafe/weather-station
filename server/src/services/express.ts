import { WeatherAPIService } from "./weather-api";
import express = require("express");
import { WeatherStation } from "../main";

export class ExpressService {
    private app: express.Express;

    constructor(private weatherStation: WeatherStation) {
        this.initApp();
    }

    private initApp() {
        this.app = express();

        // add all asset files
        this.app.use(express.static("./web/dist/"));

        this.app.get(
            "/",
            (request: express.Request, response: express.Response) => {
                response.sendFile("./web/dist/index.html");
            }
        );

        this.initWeatherRequests();

        this.app.listen(4340, () => {
            console.log("started server");
        });
    }

    private initWeatherRequests(): void {
        this.app.get(
            "/api/weather",
            async (request: express.Request, response: express.Response) => {
                response.json(
                    this.weatherStation.weatherAPIService.weatherData
                );
            }
        );
    }
}
