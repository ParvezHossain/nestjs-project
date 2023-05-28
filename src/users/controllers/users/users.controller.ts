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
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';
import { Request, Response } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enum/role.enum';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Get(':id')
    @Roles(Role.User)
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
            console.error('Error fetching user:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Internal Server Error',
            });
        }
    }

    @Get('')
    @Roles(Role.User)
    async getUsers(@Req() req: Request, @Res() res: Response) {
        try {
            const userList = await this.userService.fetchUser();
            res.status(HttpStatus.OK).json(userList);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json([]);
        }
    }

    @Public()
    @Post()
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
