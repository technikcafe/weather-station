import { EventEmitter, Injectable } from '@angular/core';
import { WeatherData } from 'src/app/interfaces/weather-data';
import { HistoryPoint } from '../../interfaces/history-point';

@Injectable({
    providedIn: 'root',
})
export class WeatherService {
    private weatherData: WeatherData | undefined;
    private onWeatherData: EventEmitter<WeatherData> =
        new EventEmitter<WeatherData>();
    private onWeatherHistory: EventEmitter<HistoryPoint[]> = new EventEmitter<
        HistoryPoint[]
    >();
    private historyPoints: Array<HistoryPoint> = [];
    private historyDaysDistance = 0;

    constructor() {
        this.getWeatherData().then(() => {
            this.getWeatherDataHistory(7);
        });
    }

    private async getWeatherData() {
        const result = await fetch(`/api/weather`);
        const weatherData: WeatherData = await result.json();
        this.onWeatherData.emit(weatherData);
        setTimeout(this.getWeatherData.bind(this), 120 * 1000);
    }

    private async getWeatherDataHistory(days: number): Promise<void> {
        if (this.historyDaysDistance > days) return;
        if (days >= 90) {
            console.log('Day distance is too big: ' + days);
            return;
        }
        const request = await fetch(`/api/weather/history?days=${days}`);
        console.log('GOT DATA!');
        this.historyPoints = await request.json();
        this.historyDaysDistance = days;
        this.onWeatherHistory.emit(this.historyPoints);
    }

    public subscribeWeatherData(callback: (weatherData: WeatherData) => void) {
        if (this.weatherData !== undefined) {
            callback(this.weatherData);
        }
        this.onWeatherData.subscribe(callback);
    }
    public subscribeWeatherHistory(
        callback: (historyPoints: HistoryPoint[]) => void
    ) {
        if (this.historyPoints.length > 0) {
            callback(this.historyPoints);
        }
        this.onWeatherHistory.subscribe(callback);
    }
}
