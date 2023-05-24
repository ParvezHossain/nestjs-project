import {
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Body,
    Get,
    Res,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth/auth.service';
import { Response } from 'express';
import { AuthGuard } from '../auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: Record<string, any>) {
        const res = await this.authService.signIn(
            signInDto.username,
            signInDto.password,
        );
        return res;
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async profile(@Res() res: Response) {
        res.status(HttpStatus.OK).json([
            {
                name: 'Parvez',
            },
        ]);
    }
}
