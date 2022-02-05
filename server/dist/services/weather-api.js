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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherAPIService = void 0;
const axios_1 = __importDefault(require("axios"));
class WeatherAPIService {
    constructor(weatherStation) {
        this.weatherStation = weatherStation;
        // get data every 60 Seconds
        setInterval(this.getWeatherData.bind(this), 60 * 1000);
        this.getWeatherData();
    }
    getWeatherData() {
        return __awaiter(this, void 0, void 0, function* () {
            const boxID = "61a4e1ac4a7833001b7d81d8";
            const sensebox_api_url = `https://api.opensensemap.org/boxes/${boxID}`;
            const senseboxData = yield (yield axios_1.default.get(sensebox_api_url)).data;
            if (senseboxData !== undefined) {
                this.weatherData = senseboxData;
                this.insertWeatherData();
            }
        });
    }
    insertWeatherData() {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
}
exports.WeatherAPIService = WeatherAPIService;
