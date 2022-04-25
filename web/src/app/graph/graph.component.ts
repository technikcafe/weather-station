import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import {
    Chart,
    ScatterController,
    LinearScale,
    PointElement,
    LineElement,
} from 'chart.js';
import { WeatherService } from '../services/weather/weather.service';
import { WeatherData } from '../interfaces/weather-data';
import { HistoryPoint } from '../interfaces/history-point';
import { IDService } from '../services/id/i-d.service';

@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit {
    @Input('sensorID') public sensorID = '61a4e1ac4a7833001b7d81e2';
    @Input('small') public small = false;

    public readonly id: number;

    constructor(
        private idService: IDService,
        private weatherService: WeatherService
    ) {
        this.id = this.idService.getID();
        this.weatherService.subscribeWeatherHistory(this.drawChart.bind(this));
    }

    public ngOnInit(): void {
        return;
    }

    private async drawChart(
        weatherHistory: Array<HistoryPoint>
    ): Promise<void> {
        const data: Array<{ x: number; y: number }> = [];
        for (const point of weatherHistory) {
            data.push({
                x: point.timestamp,
                y: <number>point[this.sensorID],
            });
        }

        const config: ChartConfiguration = {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Lichtverlauf',
                        data: data,
                        showLine: true,
                        borderColor: 'rgb(255, 0, 0)',
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        ticks: {
                            minRotation: 20,
                            callback: (value, index, ticks) => {
                                const date = new Date(value);
                                return (
                                    ('0' + date.getDate()).slice(-2) +
                                    '.' +
                                    ('0' + (date.getMonth() + 1)).slice(-2) +
                                    (!this.small
                                        ? '.' +
                                          date.getFullYear() +
                                          ' ' +
                                          ('0' + date.getHours()).slice(-2) +
                                          ':' +
                                          ('0' + date.getMinutes()).slice(-2)
                                        : '')
                                );
                            },
                        },
                    },
                },
            },
            plugins: [],
        };

        Chart.register(
            ScatterController,
            LinearScale,
            PointElement,
            LineElement
        );
        const chart = new Chart(
            <CanvasRenderingContext2D>(
                (<HTMLCanvasElement>(
                    document.getElementById('graph-canvas' + this.id)
                )).getContext('2d')
            ),
            config
        );
        chart.render();
        console.log('Finished rendering.');
    }
}
