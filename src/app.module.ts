import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { LoggerMiddleware } from './utils/logger.service';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '',
            database: 'base_visu',
            entities: [User],
            synchronize: true,
            autoLoadEntities: true,
        }),
        ConfigModule,
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
