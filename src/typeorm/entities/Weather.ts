import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'weather' })
export class Weather {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, nullable: true })
    weather_type: string;

    @Column({ length: 20 })
    icon: string;

    @Column()
    temp: number;

    @Column()
    feels_like: number;

    @Column()
    temp_min: number;

    @Column()
    temp_max: number;

    @Column()
    pressure: number;

    @Column()
    humidity: number;

    @Column()
    visibility: number;

    @Column()
    wind_speed: number;

    @Column()
    wind_deg: number;

    @Column()
    clouds: number;

    @Column()
    dt: Date;

    @Column({ nullable: true })
    createdAt: Date;
}
