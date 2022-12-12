import { EventEmitter, Injectable } from '@angular/core';
import { WeatherData } from 'src/app/interfaces/weather-data';
import { HistoryPoint } from '../../interfaces/history-point';
import { BehaviorSubject, interval, timer } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WeatherService {
    public weatherData$: BehaviorSubject<WeatherData | null> =
        new BehaviorSubject<WeatherData | null>(null);
    public weatherHistory$: BehaviorSubject<HistoryPoint[]> =
        new BehaviorSubject<HistoryPoint[]>([]);

    private historyDaysDistance = 0;
    public onSensorIDUpdate: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
        this.init();
    }

    private async init(): Promise<void> {
        await this.getWeatherData();
        interval(120 * 1000).subscribe(() => this.getWeatherData());
        await this.getWeatherDataHistory(7);
    }

    private async getWeatherData() {
        const result = await fetch(`/api/weather`);
        const weatherData: WeatherData = await result.json();

        this.weatherData$.next(weatherData);
    }

    private async getWeatherDataHistory(days: number): Promise<void> {
        if (this.historyDaysDistance > days) return;
        if (days >= 90) {
            console.log('Day distance is too big: ' + days);
            return;
        }
        const request = await fetch(`/api/weather/history?days=${days}`);
        const historyPoints = await request.json();
        this.historyDaysDistance = days;

        this.weatherHistory$.next(historyPoints);
    }
}
