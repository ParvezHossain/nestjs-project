import { Injectable } from '@nestjs/common';
import configuration from 'src/config/configuration';
import { AppConfig } from '../config.interface';

@Injectable()
export class ConfigService {
    private readonly config: AppConfig;

    constructor() {
        this.config = configuration();
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
}
