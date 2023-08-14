import { Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
import { ConfigService } from './config/services/config.service';
@ApiTags('App')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}
    @Public()
    @Get('/greet')
    getHello(@Res() res: Response): void {
        const configService = new ConfigService();
        const jsonData = {
            message: `Server is running on this IP: ${configService.getNodeHost()}`,
        };
        res.json(jsonData);
    }
    @Public()
    @Post('transcode')
    getTranscode(@Res() res: Response) {
        this.appService.transcode();
    }
}
