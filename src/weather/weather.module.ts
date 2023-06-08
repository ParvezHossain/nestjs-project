import { Module } from '@nestjs/common';
import { WeatherController } from './controllers/weather.controller';
import { WeatherService } from './services/weather.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Weather } from 'src/typeorm/entities/Weather';

@Module({
    controllers: [WeatherController],
    imports: [HttpModule, TypeOrmModule.forFeature([Weather])],
    providers: [WeatherService],
})
export class WeatherModule {}
