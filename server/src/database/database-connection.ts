import { WeatherStation } from "../main";
import mariadb = require("mariadb");
import { Pool } from "mariadb";

export class DatabaseConnection {
    private pool: Pool;

    constructor(
        private weatherStation: WeatherStation
    ) {
    }

    public async init(): Promise<void> {
        this.initDatabaseConnection();
        await this.createTables();
    }

    private initDatabaseConnection(): void {
        this.pool = mariadb.createPool(this.weatherStation.configService.config.database);
    }
    private async createTables(): Promise<void> {
        for (const value of Object.values(DatabaseTable)) {
            const statement = `CREATE TABLE weather.${value.name} (${value.args})`;
            const connection = await this.pool.getConnection();
            await connection.batch(statement);
        }
    }
}