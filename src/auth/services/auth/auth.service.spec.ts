import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
// import { UsersService } from 'src/users/services/users/users.service';
import { UsersService } from '../../../users/services/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
    let authService: AuthService;
    let userService: UsersService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: {
                        getUserByUserName: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn(),
                    },
                },
                JwtService,
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userService = module.get<UsersService>(UsersService);
        jwtService = module.get<JwtService>(JwtService);
    });

    describe('signIn', () => {
        it('should return access token when provided with valid credentials', async () => {
            const username = 'username';
            const password = 'testpass';
            const mockUser = {
                id: 1,
                username: 'testuser',
                password: await bcrypt.hash('testpassword', 12),
                email: 'testuser@example.com',
                role: 'user',
                createdAt: new Date(),
            };
            const mockJwtToken = 'mockJwtToken';
            jest.spyOn(userService, 'getUserByUserName').mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockReturnValue(true as any);
            jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockJwtToken);

            const result = await authService.signIn(username, password);
            expect(userService.getUserByUserName).toHaveBeenCalledWith(username);
            expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
            expect(jwtService.signAsync).toHaveBeenCalledWith({
                sub: mockUser.id,
                role: mockUser.role,
                username: mockUser.username,
            });
            expect(result).toEqual({ accessToken: mockJwtToken });
        });
        it('should throw UnauthorizedException when provided with invalid credentials', async () => {
            // Mock user and credentials
            const username = 'testuser';
            const password = 'testpassword';
            const mockUser = {
                id: 1,
                username: 'testuser',
                password: await bcrypt.hash('correctpassword', 10), // Correct password hash
                email: 'testuser@example.com',
                role: 'user',
                createdAt: new Date(),
            };

            // Mock the userService.getUserByUserName method to return the mockUser
            jest.spyOn(userService, 'getUserByUserName').mockResolvedValue(mockUser);

            /* jest.spyOn(bcrypt, 'compare').mockImplementation(() =>
                Promise.resolve(false),
            ); */

            // Mock the bcrypt.compare method to resolve the promise based on the password and hash
            jest.spyOn(bcrypt, 'compare').mockImplementation(async (pass: string, hash: string) => {
                const isMatch = await bcrypt.compare(pass, hash);
                return isMatch;
            });

            // Mock the jwtService.signAsync method to return a dummy access token
            jest.spyOn(jwtService, 'signAsync').mockResolvedValue('dummyToken');

            // Assert that the authService.signIn method throws an UnauthorizedException
            await expect(authService.signIn(username, password)).rejects.toThrow(UnauthorizedException);
        });
    });
});
