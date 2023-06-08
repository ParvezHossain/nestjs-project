import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Weather } from 'src/typeorm/entities/Weather';
import { Repository } from 'typeorm';
@Injectable()
export class WeatherService {
    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(Weather)
        private readonly weatherRepository: Repository<Weather>,
    ) {}

    @Cron(CronExpression.EVERY_10_SECONDS)
    async handleCron() {
        try {
            const response = await this.httpService
                .get(
                    'https://api.openweathermap.org/data/2.5/weather?lat=23.7104&lon=90.40744&appid=f91e39708043133797454089bbcaec35',
                )
                .toPromise();

            const weather = new Weather();
            weather.weather_type = response.data.weather[0].main;
            weather.icon = response.data.weather[0].icon;
            weather.temp = response.data.main.temp;
            weather.feels_like = response.data.main.feels_like;
            weather.temp_min = response.data.main.temp_min;
            weather.temp_max = response.data.main.temp_max;
            weather.pressure = response.data.main.pressure;
            weather.humidity = response.data.main.humidity;
            weather.visibility = response.data.visibility;
            weather.wind_speed = response.data.wind.wind_speed;
            weather.wind_deg = response.data.wind.wind_deg;
            weather.clouds = response.data.clouds.all;
            weather.dt = new Date(response.data.dt * 1000);
            weather.createdAt = new Date();

            await this.weatherRepository.save(weather);

        } catch (error) {
            throw new Error('Failed to create user');
        }
    }
}
