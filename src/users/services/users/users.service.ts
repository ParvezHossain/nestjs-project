import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserParams, UpdateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/typeorm/entities/User';
import { ConfigService } from 'src/config/services/config.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
    ) {}

    getUserById(id: number): Promise<User> {
        return this.userRepository.findOne({ where: { id: id } });
    }

    getUserByUserName(username: string): Promise<User> {
        return this.userRepository.findOne({ where: { username: username } });
    }

    fetchUser() {
        return this.userRepository.find();
    }
    fetchUserV2() {
        return this.userRepository.find({
            select: ['id', 'username', 'email', 'role', 'createdAt'],
        });
    }
    async createUser(userDetails: CreateUserParams) {
        const salt = this.configService.getSalt();
        const { password } = userDetails;
        const hash = await bcrypt.hash(password, salt);
        const newUser = this.userRepository.create({
            ...userDetails,
            password: hash,
            createdAt: new Date(),
        });
        delete newUser.password;
        return this.userRepository.save(newUser);
    }
    updateUser(id: number, updateUserDetails: UpdateUserParams) {
        return this.userRepository.update({ id }, { ...updateUserDetails });
    }
    deleteUser(id: number) {
        return this.userRepository.delete(id);
    }
}
