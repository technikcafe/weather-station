"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseTable = void 0;
class DatabaseTable {
    constructor(name, args) {
        this.name = name;
        this.args = args;
    }
}
exports.DatabaseTable = DatabaseTable;
DatabaseTable.LAST_30_DAYS = new DatabaseTable("last_30_days", "timestamp bigint, sensorid varchar(255), value varchar(255)");
