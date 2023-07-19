import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as winston from 'winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.simple(),
                winston.format.printf(info => {
                    const log = `[${info.timestamp}] [${info.level}] ${info.message}`;
                    return log;
                }),
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: 'logs.log',
                    options: {
                        flags: 'w',
                    },
                }),
            ],
        });
    }

    use(req: Request, res: Response, next: NextFunction) {
        next(); // Call the next function to continue the request processing
    }

    log(message: string, context?: string) {
        this.logger.log('info', message, { context });
    }

    error(message: string, trace?: string, context?: string) {
        this.logger.error(message, { trace, context });
    }

    warn(message: string, context?: string) {
        this.logger.warn(message, { context });
    }
}
