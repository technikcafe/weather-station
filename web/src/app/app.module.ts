import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CurrentWeatherValuesComponent } from './current-weather-values/current-weather-values.component';

@NgModule({
    declarations: [AppComponent, CurrentWeatherValuesComponent],
    imports: [BrowserModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
