import { Component, OnInit } from '@angular/core';
import { Sensor, WeatherData } from '../interfaces/weather-data';
import { WeatherService } from '../services/weather/weather.service';

@Component({
    selector: 'app-current-weather-values',
    templateUrl: './current-weather-values.component.html',
    styleUrls: ['./current-weather-values.component.scss'],
})
export class CurrentWeatherValuesComponent implements OnInit {
    public weatherData: WeatherData | undefined;
    public temperatureSensor: Sensor | undefined;
    public coldness = 1;
    public sensorsToShow: Array<string> = [];

    public paletteColors: string[] = [
        '#FC4F4F',
        '#FFBC80',
        '#FF9F45',
        '#F76E11',
        '#B33030',
    ];
    public indexCount = 0;

    constructor(public weatherService: WeatherService) {}

    public ngOnInit(): void {
        this.weatherService.subscribeWeatherData(this.onWeatherData.bind(this));
    }

    private onWeatherData(weatherData: WeatherData) {
        this.weatherData = weatherData;
        this.weatherData.sensors = this.weatherData.sensors.filter(
            (sensor) =>
                sensor.lastMeasurement !== undefined &&
                parseFloat(sensor.lastMeasurement.value) !== 0
        );
        this.temperatureSensor = weatherData?.sensors?.filter(
            (sensor) => sensor.title === 'Temperatur'
        )?.[0];
        this.coldness =
            <number>(<unknown>this.temperatureSensor?.lastMeasurement?.value) /
            25;
        console.log('WEATHER DATA: ', weatherData);
    }

    public getColor(): string {
        this.indexCount++;
        if (this.indexCount >= this.paletteColors.length) {
            this.indexCount = 0;
        }
        return <string>this.paletteColors[this.indexCount];
    }

    public showSensor(sensorID: string) {
        console.log('show sensor:', sensorID);
        if (!this.sensorsToShow.includes(sensorID))
            this.sensorsToShow.push(sensorID);
    }
    public hideSensor(sensorID: string) {
        this.sensorsToShow = this.sensorsToShow.filter(
            (obj) => obj !== sensorID
        );
    }
}
