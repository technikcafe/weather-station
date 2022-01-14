import { Component, OnInit } from '@angular/core';
import { Sensor, WeatherData } from '../interfaces/weather-data';
import { WeatherService } from '../services/weather/weather.service';

@Component({
    selector: 'app-current-weather-values',
    templateUrl: './current-weather-values.component.html',
    styleUrls: ['./current-weather-values.component.css'],
})
export class CurrentWeatherValuesComponent implements OnInit {
    public weatherData: WeatherData | undefined;
    public temperatureSensor: Sensor | undefined;

    constructor(private weatherService: WeatherService) {
    }

    public ngOnInit(): void {
        this.weatherService.subscribeWeatherData(this.onWeatherData.bind(this));
    }

    private onWeatherData(weatherData: WeatherData) {
        this.weatherData = weatherData;
        this.temperatureSensor = weatherData?.sensors?.filter(
            (sensor) => sensor.title === 'Temperatur'
        )?.[0];
        console.log('WEATHER DATA: ', weatherData);
    }
}
