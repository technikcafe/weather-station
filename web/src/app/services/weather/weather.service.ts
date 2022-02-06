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
    private historyPoints: Array<HistoryPoint> = [];
    private historyDaysDistance = 0;

    constructor() {
        this.getWeatherData().then(() => {
            this.getWeatherDataHistory(7);
        });
    }

    private async getWeatherData() {
        const result = await fetch('/api/weather');
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
        this.historyPoints = await request.json();
        this.historyDaysDistance = days;
    }

    public subscribeWeatherData(callback: (weatherData: WeatherData) => void) {
        if (this.weatherData !== undefined) {
            callback(this.weatherData);
        }
        this.onWeatherData.subscribe(callback);
    }
}
