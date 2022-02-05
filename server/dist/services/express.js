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
exports.ExpressService = void 0;
const express = require("express");
class ExpressService {
    constructor(weatherStation) {
        this.weatherStation = weatherStation;
        this.initApp();
    }
    initApp() {
        this.app = express();
        // add all asset files
        this.app.use(express.static("./web/dist/"));
        this.app.get("/", (request, response) => {
            response.sendFile("./web/dist/index.html");
        });
        this.initWeatherRequests();
        this.app.listen(4340, () => {
            console.log("started server");
        });
    }
    initWeatherRequests() {
        this.app.get("/api/weather", (request, response) => __awaiter(this, void 0, void 0, function* () {
            response.json(this.weatherStation.weatherAPIService.weatherData);
        }));
    }
}
exports.ExpressService = ExpressService;
