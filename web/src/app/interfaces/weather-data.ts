export interface Sensor {
    title: string;
    unit: string;
    sensorType: string;
    icon: string;
    _id: string;
    lastMeasurement: {
        value: string;
        createdAt: string;
    };
}
export interface WeatherData {
    _id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    currentLocation: {
        type: string;
        coordinates: [number, number];
        timestamp: string;
    };
    grouptag: string;
    exposure: string;
    sensors: Array<Sensor>;
    model: string;
    lastMeasurementAt: string;
    image: string;
    loc: Array<{
        geometry: any;
        type: string;
    }>;
    minutesOffline: number;
}
