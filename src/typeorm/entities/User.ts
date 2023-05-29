import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 255, nullable: false })
    username: string;

    @Column()
    password: string;

    @Column({ unique: true, nullable: false })
    @IsEmail({}, { message: 'Invalid email format' })
    @Transform(({ value }) => value.toLowerCase()) // Optional: transform email to lowercase
    email: string;

    @Column({ nullable: false, default: 'user' })
    role: string;

    @Column()
    createdAt: Date;
}
