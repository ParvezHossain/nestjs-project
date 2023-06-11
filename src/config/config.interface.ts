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
    throttle: {
        ttl: number;
        limit: number;
    };
    cache: {
        ttl: number;
        max: number;
    };
    redis: {
        host: string;
        port: number;
    };
}
