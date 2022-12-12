import axios from "axios";
import express = require("express");
import { WeatherData } from "../interfaces/weather-data";
import { WeatherStation } from "../main";
import { DatabaseTable } from "../enums/mariadb-table";

export interface HistoryPoint {
    timestamp: number;
    [key: string]: string | number;
}

export class WeatherAPIService {
    public weatherData: WeatherData;
    public historyPoints: Array<HistoryPoint> = [];

    constructor(private weatherStation: WeatherStation) {
        // get data every 60 Seconds
        setInterval(this.getWeatherData.bind(this), 5 * 60 * 1000);

        this.getWeatherData();

        this.loadHistoryPoints();
    }

    private async loadHistoryPoints() {
        const statement = `SELECT * FROM weather.${DatabaseTable.LAST_30_DAYS.name}`;
        const connection =
            await this.weatherStation.databaseConnection.pool.getConnection();
        const rows = await connection.query(statement);
        const usedTimestamps: Array<number> = [];
        rows.forEach((obj) => {
            if (!usedTimestamps.includes(obj.timestamp)) {
                const historyPoint: HistoryPoint = {
                    timestamp: obj.timestamp,
                };
                const data = rows.filter(
                    (row) => row.timestamp === obj.timestamp
                );
                data.forEach((point) => {
                    historyPoint[point.sensorid] = point.value;
                });
                this.historyPoints.push(historyPoint);
                usedTimestamps.push(obj.timestamp);
            }
        });
    }

    private async getWeatherData(): Promise<void> {
        const boxID = "61a4e1ac4a7833001b7d81d8";
        const sensebox_api_url = `https://api.opensensemap.org/boxes/${boxID}`;
        let senseboxData: WeatherData = await (
            await axios.get(sensebox_api_url)
        ).data;
        if (senseboxData !== undefined) {
            senseboxData = this.controlLastUpdate(senseboxData);

            this.weatherData = senseboxData;
            this.insertWeatherData();
        }
    }

    private controlLastUpdate(weatherData: WeatherData): WeatherData {
        const date = new Date(weatherData.lastMeasurementAt).getTime();
        const currentDate: number = Date.now();

        const delta = currentDate - date;
        const seconds = delta / 1000;
        const minutes = seconds / 60;

        weatherData.minutesOffline = Math.floor(minutes);

        return weatherData;
    }

    private async insertWeatherData(): Promise<void> {
        const timestamp = new Date().getTime();

        const point: HistoryPoint = {
            timestamp: timestamp,
        };

        for (const sensor of this.weatherData.sensors) {
            if (sensor.lastMeasurement === undefined) continue;
            const sensorid = sensor._id;
            const value = sensor.lastMeasurement.value;

            point[sensorid] = value;

            const statement = `INSERT INTO weather.${DatabaseTable.LAST_30_DAYS.name} (timestamp, sensorid, value) VALUES (${timestamp}, "${sensorid}", "${value}")`;
            const connection =
                await this.weatherStation.databaseConnection.pool.getConnection();
            await connection.query(statement);
            await connection.release();
        }
        this.historyPoints.push(point);

        // clear old data
        const dateBefore = new Date();
        dateBefore.setDate(dateBefore.getDate() - 90);

        const statement = `DELETE FROM weather.${
            DatabaseTable.LAST_30_DAYS.name
        } WHERE timestamp < ${dateBefore.getTime()}`;
        const connection =
            await this.weatherStation.databaseConnection.pool.getConnection();
        await connection.query(statement);
        await connection.release();
    }
}
