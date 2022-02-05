"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const fs = require("fs");
const path = require("path");
class ConfigService {
    constructor() {
        this.configFolder = path.resolve("./config");
        this.configPath = path.join(this.configFolder, "./config.json");
        this.loadConfig();
        this.save();
    }
    loadConfig() {
        if (!fs.existsSync(this.configFolder)) {
            fs.mkdirSync(this.configFolder);
        }
        if (!fs.existsSync(this.configPath)) {
            this.config = {
                database: {
                    host: "",
                    user: "",
                    password: "",
                    connectionLimit: 5,
                    port: 4040,
                },
            };
        }
        else {
            this.config = JSON.parse(fs.readFileSync(this.configPath).toString());
        }
    }
    save() {
        fs.writeFileSync(this.configPath, JSON.stringify(this.config, undefined, 2));
    }
}
exports.ConfigService = ConfigService;
