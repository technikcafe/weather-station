import { Component } from '@angular/core';
import { WeatherService } from './services/weather/weather.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    title = 'weather-station-web';

    public math: typeof Math = Math;

    constructor(public weatherService: WeatherService) {}
}
