import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';
import { Blog } from 'src/blog/entities/blog.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum UserType {
    User = 'user',
    Admin = 'admin',
    Super = 'super',
    Viewer = 'viewer',
}

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 255, nullable: false })
    @ApiProperty()
    @IsNotEmpty({ message: 'Username is required' })
    @MinLength(6, { message: 'Username must be at least 6 characters long' })
    @MaxLength(50, {
        message: 'Username must be not more than 50 characters long',
    })
    @Matches(/^[A-Za-z0-9_@-]+$/, {
        message:
            'Username should be a single word with only underscore, @ sign, hyphen sign, and numeric numbers',
    })
    username: string;

    @Column()
    @ApiProperty()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @MaxLength(50, {
        message: 'Password must be not more than 50 characters long',
    })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        {
            message:
                'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character',
        },
    )
    password: string;

    @Column({ unique: true, nullable: false })
    @IsEmail({}, { message: 'Invalid email format' })
    @Transform(({ value }) => value.toLowerCase()) // Optional: transform email to lowercase
    @ApiProperty()
    email: string;

    @Column({ type: 'enum', enum: UserType, default: UserType.User })
    @ApiProperty({ enum: UserType })
    @IsEnum(UserType, { message: 'Invalid role' })
    role: UserType;

    @OneToMany(() => Blog, (blog) => blog.createdBy, { cascade: true })
    blogs: Blog[];

    @Column()
    createdAt: Date;
}
