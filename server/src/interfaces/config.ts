export interface Config {
    database: {
        host: string;
        user: string;
        password: string;
        connectionLimit: number;
        port: number;
    };
}
