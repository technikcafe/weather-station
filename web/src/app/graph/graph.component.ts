import {
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from '@angular/core';
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
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-graph',
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit, OnChanges, OnDestroy {
    private readonly MAX_POINTS_PER_SMALL_GRAPH = 40;
    private readonly MAX_POINTS_PER_MAX_GRAPH = 250;

    private destroy$: Subject<void> = new Subject<void>();

    @Input('sensorID') public sensorID = '61a4e1ac4a7833001b7d81e2';
    @Input('small') public small = false;
    @Input('show') public show = false;

    private weatherData: WeatherData | undefined;
    private weatherHistory: Array<HistoryPoint> = [];
    private chart: Chart | undefined;

    public sensorTitle = '';

    public readonly id: number;

    constructor(
        private idService: IDService,
        private weatherService: WeatherService
    ) {
        this.id = this.idService.getID();
    }

    public ngOnInit(): void {
        if (!this.small) {
            this.show = true;
            this.weatherService.onSensorIDUpdate.subscribe((data) => {
                this.sensorID = data;
                if (this.chart !== undefined) this.chart.destroy();
                if (this.weatherHistory === undefined) return;
                this.drawChart(this.weatherHistory);

                if (this.weatherData !== undefined) {
                    const title = this.weatherData.sensors.find(
                        (sensor) => sensor._id === this.sensorID
                    )?.title;
                    if (title !== undefined) {
                        this.sensorTitle = title;
                    }
                }
            });
        }
        this.weatherService.weatherHistory$
            .pipe(takeUntil(this.destroy$))
            .subscribe(async (data) => {
                this.weatherHistory = data;
                if (this.show) await this.drawChart(this.weatherHistory);
            });
        this.weatherService.weatherData$
            .pipe(takeUntil(this.destroy$))
            .subscribe(async (data) => {
                if (!data) return;
                this.weatherData = data;
                const title = data.sensors.find(
                    (sensor) => sensor._id === this.sensorID
                )?.title;
                if (title !== undefined) {
                    this.sensorTitle = title;
                }
            });
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes['show'] !== undefined) {
            if (changes['show'].currentValue) {
                this.drawChart(this.weatherHistory);
            } else if (this.chart !== undefined) {
                this.chart.destroy();
                this.chart = undefined;
            }
        }
    }

    private async drawChart(
        weatherHistory: Array<HistoryPoint>
    ): Promise<void> {
        const data: Array<{ x: number; y: number }> = [];
        for (
            let i = 0;
            i < weatherHistory.length;
            i +=
                weatherHistory.length /
                (this.small
                    ? this.MAX_POINTS_PER_SMALL_GRAPH
                    : this.MAX_POINTS_PER_MAX_GRAPH)
        ) {
            const point = weatherHistory[Math.floor(i)];
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
                        borderColor: 'rgb(0, 0, 255)',
                    },
                ],
            },
            options: {
                hover: {
                    intersect: false,
                },
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

        this.chart = chart;
        console.log('Finished rendering.');
    }

    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
