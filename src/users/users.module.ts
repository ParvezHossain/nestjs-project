import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { ConfigService } from 'src/config/services/config.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/roles.guard';
import { LoggerMiddleware } from 'src/utils/logger.service';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [
        UsersService,
        ConfigService,
        LoggerMiddleware,
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
    exports: [UsersService],
})
export class UsersModule {}
