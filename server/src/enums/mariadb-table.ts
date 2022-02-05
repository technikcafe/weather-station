export class DatabaseTable {
    public static LAST_30_DAYS: DatabaseTable = new DatabaseTable(
        "last_30_days",
        "timestamp int, sensorid varchar(255), value varchar(255)"
    );

    constructor(public name: string, public args: string) {}
}
