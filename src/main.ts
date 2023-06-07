import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import helmet from 'helmet';
import { ConfigService } from './config/services/config.service';
import * as csurf from 'csurf';
import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';

async function bootstrap() {
    dotenv.config({
        path: path.resolve(__dirname, '../src/', 'config', '.env'),
    });
    const app = await NestFactory.create(AppModule, {
        cors: true,
    });
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: VERSION_NEUTRAL,
    });
    // app.use(csurf());
    app.use(
        helmet({
            hsts: {
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true,
            },
            crossOriginEmbedderPolicy: false,
            contentSecurityPolicy: {
                directives: {
                    imgSrc: [
                        `'self'`,
                        'data:',
                        'apollo-server-landing-page.cdn.apollographql.com',
                    ],
                    scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
                    manifestSrc: [
                        `'self'`,
                        'apollo-server-landing-page.cdn.apollographql.com',
                    ],
                    frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
                },
            },
        }),
    );
    const configService = new ConfigService();
    await app.listen(configService.getPort());
}
bootstrap();
