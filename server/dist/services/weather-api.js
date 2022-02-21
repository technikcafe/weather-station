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
const mariadb_table_1 = require("../enums/mariadb-table");
class WeatherAPIService {
    constructor(weatherStation) {
        this.weatherStation = weatherStation;
        this.historyPoints = [];
        // get data every 60 Seconds
        setInterval(this.getWeatherData.bind(this), 5 * 60 * 1000);
        this.getWeatherData();
        this.loadHistoryPoints();
    }
    loadHistoryPoints() {
        return __awaiter(this, void 0, void 0, function* () {
            const statement = `SELECT * FROM weather.${mariadb_table_1.DatabaseTable.LAST_30_DAYS.name}`;
            const connection = yield this.weatherStation.databaseConnection.pool.getConnection();
            const rows = yield connection.query(statement);
            const usedTimestamps = [];
            rows.forEach((obj) => {
                if (!usedTimestamps.includes(obj.timestamp)) {
                    const historyPoint = {
                        timestamp: obj.timestamp,
                    };
                    const data = rows.filter((row) => row.timestamp === obj.timestamp);
                    data.forEach((point) => {
                        historyPoint[point.sensorid] = point.value;
                    });
                    this.historyPoints.push(historyPoint);
                    usedTimestamps.push(obj.timestamp);
                }
            });
        });
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
            const timestamp = new Date().getTime();
            const point = {
                timestamp: timestamp,
            };
            for (const sensor of this.weatherData.sensors) {
                if (sensor.lastMeasurement === undefined)
                    continue;
                const sensorid = sensor._id;
                const value = sensor.lastMeasurement.value;
                point[sensorid] = value;
                const statement = `INSERT INTO weather.${mariadb_table_1.DatabaseTable.LAST_30_DAYS.name} (timestamp, sensorid, value) VALUES (${timestamp}, "${sensorid}", "${value}")`;
                const connection = yield this.weatherStation.databaseConnection.pool.getConnection();
                yield connection.query(statement);
                yield connection.release();
            }
            this.historyPoints.push(point);
            // clear old data
            const dateBefore = new Date();
            dateBefore.setDate(dateBefore.getDate() - 90);
            const statement = `DELETE FROM weather.${mariadb_table_1.DatabaseTable.LAST_30_DAYS.name} WHERE timestamp < ${dateBefore.getTime()}`;
            const connection = yield this.weatherStation.databaseConnection.pool.getConnection();
            yield connection.query(statement);
            yield connection.release();
        });
    }
}
exports.WeatherAPIService = WeatherAPIService;
