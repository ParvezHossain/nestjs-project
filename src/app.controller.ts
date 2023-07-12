import { Controller, Get, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';
@ApiTags('App')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}
    @Public()
    @Get()
    getHello(@Res() res: Response): void {
        const jsonData = { message: 'Hello, World!' };
        res.json(jsonData);
    }
    @Public()
    @Post('transcode')
    getTranscode(@Res() res: Response) {
        this.appService.transcode();
    }
}
