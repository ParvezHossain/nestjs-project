import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import helmet from 'helmet';
import { ConfigService } from './config/services/config.service';

async function bootstrap() {
    dotenv.config({
        path: path.resolve(__dirname, '../src/', 'config', '.env'),
    });
    const app = await NestFactory.create(AppModule, {
        cors: true,
    });
    app.use(
        helmet({
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
