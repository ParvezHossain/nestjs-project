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
@Module({
    imports: [
        ConfigModule,
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
                entities: [User],
                synchronize: true,
                extra: {
                    connectionLimit: 10,
                },
            }),
        }),
        AuthModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService, LoggerMiddleware],
})
export class AppModule {
    constructor(private readonly logger: LoggerMiddleware) {}
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(this.logger.use.bind(this.logger)).forRoutes('*');
    }
}
