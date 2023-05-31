import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
    let service: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ConfigService],
        }).compile();

        service = module.get<ConfigService>(ConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('should get the correct value for the "database.host" configuration', () => {
        const expectedHost = 'localhost';
        const actualHost = service.database.host;
        expect(actualHost).toEqual(expectedHost);
    });
});
