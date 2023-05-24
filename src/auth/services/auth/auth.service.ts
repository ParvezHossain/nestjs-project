import {
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/typeorm/entities/User';
import { UsersService } from 'src/users/services/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private jwtService: JwtService,
    ) {}

    async signIn(username: string, pass: string): Promise<any> {
        try {
            const user = await this.userService.getUserByUserName(username);
            if (user?.password !== pass) {
                throw new UnauthorizedException();
            }
            const { password, ...result } = user;
            const payload = {
                sub: result.id,
                username: result.username,
            };
            return {
                accessToken: await this.jwtService.signAsync(payload),
            };
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }
}
