import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CurrentWeatherValuesComponent } from './current-weather-values/current-weather-values.component';
import { GraphComponent } from './graph/graph.component';

@NgModule({
    declarations: [AppComponent, CurrentWeatherValuesComponent, GraphComponent],
    imports: [BrowserModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
