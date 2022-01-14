import { EventEmitter, Injectable } from '@angular/core';
import { WeatherData } from 'src/app/interfaces/weather-data';

@Injectable({
    providedIn: 'root',
})
export class WeatherService {
    private weatherData: WeatherData | undefined;
    private onWeatherData: EventEmitter<WeatherData> =
        new EventEmitter<WeatherData>();

    constructor() {
        this.getWeatherData();
    }

    private async getWeatherData() {
        const result = await fetch('/api/weather');
        const weatherData: WeatherData = await result.json();
        this.onWeatherData.emit(weatherData);
        setTimeout(this.getWeatherData.bind(this), 120 * 1000);
    }

    public subscribeWeatherData(callback: (weatherData: WeatherData) => void) {
        if (this.weatherData !== undefined) {
            callback(this.weatherData);
        }
        this.onWeatherData.subscribe(callback);
    }
}
