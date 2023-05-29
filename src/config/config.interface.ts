export interface AppConfig {
    port: number;
    database: {
        host: string;
        port: number;
        user: string;
        password: string;
        name: string;
    };
    jwt: string;
    salt: number;
}
