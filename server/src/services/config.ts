import { Config } from "../interfaces/config";
import fs = require("fs");
import path = require("path");

export class ConfigService {
    public config: Config;
    public configFolder: string;
    public configPath: string;

    constructor() {
        this.configFolder = path.resolve("./config");
        this.configPath = path.join(this.configFolder, "./config.json");
        this.loadConfig();
        this.save();
    }

    private loadConfig(): void {
        if (!fs.existsSync(this.configFolder)) {
            fs.mkdirSync(this.configFolder);
        }
        if (!fs.existsSync(this.configPath)) {
            this.config = {
                database: {
                    host: "",
                    user: "",
                    password: "",
                    connectionLimit: 5
                }
            }
        } else {
            this.config = JSON.parse(fs.readFileSync(this.configPath).toString());
        }
    }

    public save(): void {
        fs.writeFileSync(this.configPath, JSON.stringify(this.config, undefined, 2));
    }
}