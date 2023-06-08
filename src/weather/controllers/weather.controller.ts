import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { Weather } from 'src/typeorm/entities/Weather';
import { Repository } from 'typeorm';

@ApiBearerAuth()
@ApiTags('Weather')
@Controller('weather')
export class WeatherController {
    constructor(
        @InjectRepository(Weather)
        private readonly weatherRepository: Repository<Weather>,
    ) {}

    @Public()
    @Get()
    async getWeather(@Res() res: Response) {
        const weather = await this.weatherRepository.find();
        res.status(HttpStatus.OK).json(weather);
    }
}
