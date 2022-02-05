import express = require("express");
import axios from "axios";
import { WeatherAPIService } from "./services/weather-api";
import { ExpressService } from "./services/express";
import { ConfigService } from "./services/config";
import { DatabaseConnection } from "./database/database-connection";

export class WeatherStation {
    // services
    public configService: ConfigService;
    public databaseConnection: DatabaseConnection;
    public expressService: ExpressService;
    public weatherAPIService: WeatherAPIService;

    constructor() {
        this.initServices();
    }

    private async initServices() {
        this.configService = new ConfigService();
        this.databaseConnection = new DatabaseConnection(this);
        await this.databaseConnection.init();
        this.expressService = new ExpressService(this);
        this.weatherAPIService = new WeatherAPIService(this);
    }
}
new WeatherStation();