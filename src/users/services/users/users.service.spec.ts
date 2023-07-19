import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '../../../../src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { ConfigService } from '../../../../src/config/services/config.service';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
    let service: UsersService;
    let userRepository: Repository<User>;
    let configService: ConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                ConfigService,
                {
                    provide: 'UserRepository', // Provide a custom token for the UserRepository
                    useClass: Repository,
                },
            ],
        })
            .overrideProvider(ConfigService)
            .useValue({
                getSalt: jest.fn().mockReturnValue(10),
            })
            .compile();

        service = module.get<UsersService>(UsersService);
        userRepository = module.get<Repository<User>>('UserRepository');
        configService = module.get<ConfigService>(ConfigService);
    });

    describe('getUserById', () => {
        it('should return a user by ID', async () => {
            // Mock the user repository's findOne method
            const mockUser: User = {
                id: 1,
                username: 'testuser',
                password: 'testpassword',
                email: 'ychag@example.com',
                role: 'user',
                createdAt: new Date(),
            };
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

            const userId = 1;
            const result = await service.getUserById(userId);

            expect(result).toEqual(mockUser);
            expect(userRepository.findOne).toHaveBeenCalledWith({
                where: { id: userId },
            });
        });
    });

    describe('getUserByUserName', () => {
        it('should return a user by username', async () => {
            // Mock the user repository's findOne method
            const mockUser: User = {
                id: 1,
                username: 'testuser',
                password: 'testpassword',
                email: 'ychag@example.com',
                role: 'user',
                createdAt: new Date(),
            };
            jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

            const username = 'testuser';
            const result = await service.getUserByUserName(username);

            expect(result).toEqual(mockUser);
            expect(userRepository.findOne).toHaveBeenCalledWith({
                where: { username: username },
            });
        });
    });

    describe('fetchUser', () => {
        it('should return a list of users', async () => {
            // Mock the user repository's find method
            const mockUsers: User[] = [
                {
                    id: 1,
                    username: 'testuser',
                    password: 'testpassword',
                    email: 'ychag@example.com',
                    role: 'user',
                    createdAt: new Date(),
                },
                {
                    id: 2,
                    username: 'testuser2',
                    password: 'testpassword2',
                    email: 'ychag@example.com2',
                    role: 'user2',
                    createdAt: new Date(),
                },
            ];
            jest.spyOn(userRepository, 'find').mockResolvedValue(mockUsers);

            const result = await service.fetchUser();

            expect(result).toEqual(mockUsers);
            expect(userRepository.find).toHaveBeenCalled();
        });
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            // Mock the user repository's create and save methods
            const mockUserDetails = {
                id: 1,
                username: 'testuser',
                password: 'testpassword',
                email: 'ychag@example.com',
                role: 'user',
            };
            const mockSalt = 10;
            const mockHash = 'hashedPassword';
            const mockNewUser: User = {
                id: 1,
                username: 'testuser',
                password: mockHash,
                email: 'ychag@example.com',
                role: 'user',
                createdAt: new Date(),
            };

            jest.spyOn(configService, 'getSalt').mockReturnValue(mockSalt);
            jest.spyOn(bcrypt, 'hash').mockImplementation(async () => mockHash as string);
            jest.spyOn(userRepository, 'create').mockReturnValue(mockNewUser);
            jest.spyOn(userRepository, 'save').mockResolvedValue(mockNewUser);

            const result = await service.createUser(mockUserDetails);

            expect(result).toEqual(mockNewUser);
            expect(configService.getSalt).toHaveBeenCalled();
            expect(bcrypt.hash).toHaveBeenCalledWith(mockUserDetails.password, mockSalt);
            expect(userRepository.create).toHaveBeenCalledWith({
                ...mockUserDetails,
                password: mockHash,
                createdAt: expect.any(Date),
            });
            expect(userRepository.save).toHaveBeenCalledWith(mockNewUser);
        });
    });

    describe('updateUser', () => {
        it('should update a user', async () => {
            // Mock the user repository's update method
            const userId = 1;
            const mockUpdateUserDetails = {
                username: 'newusername',
                password: 'newpassword',
                email: 'ychag@example.com',
                role: 'user2',
            };

            jest.spyOn(userRepository, 'update').mockResolvedValue(undefined);

            await service.updateUser(userId, mockUpdateUserDetails);

            expect(userRepository.update).toHaveBeenCalledWith({ id: userId }, mockUpdateUserDetails);
        });
    });

    describe('deleteUser', () => {
        it('should delete a user', async () => {
            // Mock the user repository's delete method
            const userId = 1;

            jest.spyOn(userRepository, 'delete').mockResolvedValue(undefined);

            await service.deleteUser(userId);

            expect(userRepository.delete).toHaveBeenCalledWith(userId);
        });
    });
});
