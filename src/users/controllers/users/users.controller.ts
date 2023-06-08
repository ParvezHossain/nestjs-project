import {
    Body,
    Controller,
    Delete,
    Get,
    Req,
    Res,
    Param,
    ParseIntPipe,
    Post,
    Put,
    HttpStatus,
    UsePipes,
    ValidationPipe,
    Header,
    UseGuards,
    Inject,
} from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enum/role.enum';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';
import { LoggerMiddleware } from 'src/utils/logger.service';
import { SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { User } from 'src/typeorm/entities/User';
import { Cache } from 'cache-manager';

@Controller('users')
// This controller is now eligible for rate limiting as the Throttle will be applied to it.
@UseGuards(ThrottlerGuard)
// This applies to skip the rate limiting to all api of this controller
@SkipThrottle()
export class UsersController {
    constructor(
        private userService: UsersService,
        private readonly logger: LoggerMiddleware,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    @Get(':id')
    @Roles(Role.Admin)
    async getUserById(
        @Param('id', ParseIntPipe) id: number,
        @Res() res: Response,
    ) {
        try {
            const user = await this.userService.getUserById(id);
            if (user) {
                res.status(HttpStatus.OK).json(user);
            } else {
                res.status(HttpStatus.NOT_FOUND).json({
                    message: 'User not found',
                });
            }
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Internal Server Error',
            });
        }
    }

    @Get('')
    @Roles(Role.Admin)
    @Header('Cache-Control', 'none')
    @SkipThrottle(false)
    // Override default configuration for Rate limiting and duration.
    @Throttle(3, 60)
    async getUsers(@Req() req: Request, @Res() res: Response) {
        this.logger.log('Test Logger');
        try {
            const cachedUsers = await this.cacheManager.get<User[]>('users');
            if (cachedUsers) {
                console.log('from cached');
                res.status(HttpStatus.OK).json(cachedUsers);
            } else {
                const userList = await this.userService.fetchUser();
                await this.cacheManager.set('users', userList);
                res.status(HttpStatus.OK).json(userList);
            }
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json([]);
        }
    }

    @Public()
    @Post()
    @UsePipes(ValidationPipe)
    // This will override the throttling configuration and will appy the rate limit
    @SkipThrottle(false)
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Put(':id')
    @Roles(Role.Admin)
    async updateUserById(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        await this.userService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    @Roles(Role.Admin)
    async deleteUserById(@Param('id', ParseIntPipe) id: number) {
        await this.userService.deleteUser(id);
    }
}
