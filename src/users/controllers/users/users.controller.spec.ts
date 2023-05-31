import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../../../../src/users/services/users/users.service';
import { HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerMiddleware } from '../../../../src/utils/logger.service';
import { ConfigService } from '../../../../src/config/services/config.service';
import { ThrottlerGuard } from '@nestjs/throttler';

describe('UsersController', () => {
    let controller: UsersController;
    let userService: UsersService;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                UsersService,
                LoggerMiddleware,
                ConfigService,
                {
                    provide: UsersService,
                    useValue: {
                        getUserById: jest.fn(),
                        fetchUser: jest.fn(),
                        createUser: jest.fn(),
                        updateUser: jest.fn(),
                        deleteUser: jest.fn(),
                    },
                },
            ],
        })
            .overrideGuard(ThrottlerGuard)
            .useValue({ canActivate: () => true })
            .compile();

        controller = module.get<UsersController>(UsersController);
        userService = module.get<UsersService>(UsersService);
        configService = module.get<ConfigService>(ConfigService);
    });

    describe('getUserById', () => {
        it('should return user when a valid user ID is provided', async () => {
            const userId = 1;
            const mockUser = {
                id: userId,
                username: 'John',
                password: 'password',
                email: 'parver@gmail.com',
                role: 'admin',
                createdAt: new Date(),
            };
            jest.spyOn(userService, 'getUserById').mockResolvedValue(mockUser);
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response; // Type assertion to align with the expected Response type

            await controller.getUserById(userId, res);
            expect(userService.getUserById).toHaveBeenCalledWith(userId);
            expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(res.json).toHaveBeenCalledWith(mockUser);
        });
        it('should return 404 status when user does not exist', async () => {
            const userId = 1;
            jest.spyOn(userService, 'getUserById').mockResolvedValue(null);
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response; // Type assertion to align with the expected Response type;
            await controller.getUserById(userId, res);
            expect(userService.getUserById).toHaveBeenCalledWith(userId);
            expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User not found',
            });
        });
        it('should return 500 status on error', async () => {
            const userId = 1;
            jest.spyOn(userService, 'getUserById').mockRejectedValue(
                new Error(),
            );
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response; // Type assertion to align with the expected Response type;

            await controller.getUserById(userId, res);
            expect(userService.getUserById).toHaveBeenCalledWith(userId);
            expect(res.status).toHaveBeenCalledWith(
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
            expect(res.json).toHaveBeenCalledWith({
                message: 'Internal Server Error',
            });
        });
    });

    describe('getUsers', () => {
        it('should return a list of users with status 200', async () => {
            // Mock the fetchUser method of the usersService to return a mock user list
            const mockUserList = [
                {
                    id: 1,
                    username: 'John',
                    password: 'password',
                    email: 'parver@gmail.com',
                    role: 'admin',
                    createdAt: new Date(),
                },
                {
                    id: 2,
                    username: 'Jane',
                    password: 'password',
                    email: 'parver@gmail.com',
                    role: 'admin',
                    createdAt: new Date(),
                },
                {
                    id: 3,
                    username: 'Mary',
                    password: 'password',
                    email: 'parver@gmail.com',
                    role: 'admin',
                    createdAt: new Date(),
                },
                {
                    id: 4,
                    username: 'Bob',
                    password: 'password',
                    email: 'parver@gmail.com',
                    role: 'admin',
                    createdAt: new Date(),
                },
            ];
            jest.spyOn(userService, 'fetchUser').mockResolvedValue(
                mockUserList as any,
            );
            // Create mock Request and Response objects
            const req: Request = {} as Request;
            const res: Response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as any;

            // Call the getUsers method
            await controller.getUsers(req, res);

            // Check that the response status is 200
            expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);

            // Check that the response JSON is the mock user list
            expect(res.json).toHaveBeenCalledWith(mockUserList);
        });

        it('should handle errors and return an empty list with status 500', async () => {
            // Mock the fetchUser method of the usersService to throw an error
            jest.spyOn(userService, 'fetchUser').mockRejectedValue(
                new Error('Internal Server Error'),
            );
            // Create mock Request and Response objects
            const req: Request = {} as Request;
            const res: Response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as any;

            // Call the getUsers method
            await controller.getUsers(req, res);

            // Check that the response status is 500
            expect(res.status).toHaveBeenCalledWith(
                HttpStatus.INTERNAL_SERVER_ERROR,
            );

            // Check that the response JSON is an empty list
            expect(res.json).toHaveBeenCalledWith([]);
        });
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
