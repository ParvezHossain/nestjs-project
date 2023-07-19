import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth.guard';
import { Reflector } from '@nestjs/core';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        signIn: jest.fn().mockResolvedValue({ accessToken: 'dummyToken' }),
                    },
                },
                JwtService,
                AuthGuard,
                Reflector,
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    describe('signIn', () => {
        it('should return the access token when valid credentials are provided', async () => {
            // Mock the authService.signIn method to return a dummy access token
            const mockAccessToken = 'dummyToken';
            const signInDto = {
                username: 'testuser',
                password: 'testpassword',
            };

            const response = await controller.signIn(signInDto);
            expect(response).toEqual({ accessToken: mockAccessToken });
        });
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
