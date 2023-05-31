import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Response } from 'express';

describe('AppController', () => {
    let appController: AppController;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let service: AppService;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile();

        appController = app.get<AppController>(AppController);
        service = app.get<AppService>(AppService);
    });

    describe('getHello', () => {
        it('should return "Hello, World!" message', () => {
            const responseMock: Partial<Response> = {
                json: jest.fn(),
            };
            appController.getHello(responseMock as Response);
            expect(responseMock.json).toHaveBeenCalledWith({
                message: 'Hello, World!',
            });
        });
    });
});
