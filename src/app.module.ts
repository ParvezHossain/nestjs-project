import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { UsersModule } from './users/users.module';
// import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { LoggerMiddleware } from './utils/logger.service';
import { ConfigService } from './config/services/config.service';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import * as compression from 'compression';
import { XssProtectionMiddleware } from './utils/middlewares/xssProtection.middleware';
import { XPermittedCrossDomainPoliciesMiddleware } from './utils/middlewares/xPermittedCrossDomainPolicies.middleware';
import { XDownloadOptionsMiddleware } from './utils/middlewares/xDownloadOptions.middleware';
import { XDnsPrefetchControlMiddleware } from './utils/middlewares/xDnsPrefetchControl.middleware';
import { CacheModule } from '@nestjs/cache-manager';
import { WeatherModule } from './weather/weather.module';
import { ScheduleModule } from '@nestjs/schedule';
import { Weather } from './typeorm/entities/Weather';
import { BullModule } from '@nestjs/bull';
import { TRANSCODE_QUEUE } from './utils/constants';
import { TranscodeConsumer } from './utils/consumers/transcode.consumer';
import { BlogModule } from './blog/blog.module';
import { Blog } from './blog/entities/blog.entity';
@Module({
    imports: [
        ScheduleModule.forRoot(),
        BullModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                redis: {
                    host: configService.redis.host,
                    port: configService.redis.port,
                },
            }),
        }),
        BullModule.registerQueue({
            name: TRANSCODE_QUEUE,
        }),
        CacheModule.registerAsync({
            isGlobal: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                ttl: configService.cache.ttl,
                max: configService.cache.max,
            }),
        }),
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                ttl: configService.trotlle.ttl,
                limit: configService.trotlle.limit,
            }),
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.database.host,
                port: configService.database.port,
                username: configService.database.user,
                password: configService.database.password,
                database: configService.database.name,
                entities: [User, Weather, Blog],
                synchronize: true,
                extra: {
                    connectionLimit: 10,
                },
            }),
        }),
        AuthModule,
        UsersModule,
        WeatherModule,
        BlogModule,
    ],
    controllers: [AppController],
    providers: [AppService, LoggerMiddleware, TranscodeConsumer],
})
export class AppModule {
    constructor(private readonly logger: LoggerMiddleware) {}
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(this.logger.use.bind(this.logger)).forRoutes('*');
        consumer
            .apply(compression({ level: 6, encodings: ['gzip', 'deflate'] }))
            .forRoutes('*');
        consumer.apply(XssProtectionMiddleware).forRoutes('*');
        consumer.apply(XPermittedCrossDomainPoliciesMiddleware).forRoutes('*');
        consumer.apply(XDownloadOptionsMiddleware).forRoutes('*');
        consumer.apply(XDnsPrefetchControlMiddleware).forRoutes('*');
    }
}
