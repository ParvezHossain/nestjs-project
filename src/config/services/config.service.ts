import { Injectable } from '@nestjs/common';
import { AppConfig } from '../config.interface';
import { productionConfig, developmentConfig } from '../configuration';

@Injectable()
export class ConfigService {
    private readonly config: AppConfig;
    constructor() {
        this.config =
            process.env.NODE_ENV === 'production'
                ? productionConfig()
                : developmentConfig();
    }
    getPort() {
        return this.config.port;
    }

    getJWTSecret() {
        return this.config.jwt;
    }

    getSalt() {
        return this.config.salt;
    }

    get database(): {
        host: string;
        port: number;
        user: string;
        password: string;
        name: string;
    } {
        return this.config.database;
    }

    get trotlle(): {
        ttl: number;
        limit: number;
    } {
        return this.config.throttle;
    }
}
