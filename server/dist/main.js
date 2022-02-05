"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherStation = void 0;
const weather_api_1 = require("./services/weather-api");
const express_1 = require("./services/express");
const config_1 = require("./services/config");
const database_connection_1 = require("./database/database-connection");
class WeatherStation {
    constructor() {
        this.initServices();
    }
    initServices() {
        return __awaiter(this, void 0, void 0, function* () {
            this.configService = new config_1.ConfigService();
            this.databaseConnection = new database_connection_1.DatabaseConnection(this);
            yield this.databaseConnection.init();
            this.expressService = new express_1.ExpressService(this);
            this.weatherAPIService = new weather_api_1.WeatherAPIService(this);
        });
    }
}
exports.WeatherStation = WeatherStation;
new WeatherStation();
