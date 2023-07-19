import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { UserType } from 'src/typeorm/entities/User';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(6, {
        message: 'Username is too short',
    })
    @MaxLength(50, {
        message: 'Username is too long',
    })
    @Matches(/^[A-Za-z0-9_@-]+$/, {
        message: 'Username should be a single word with only underscore, @ sign, hyphen sign, and numeric numbers',
    })
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @MaxLength(50, {
        message: 'Password must be not more than 50 characters long',
    })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
        message:
            'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character',
    })
    password: string;

    @IsEmail()
    @IsEmail({}, { message: 'Invalid email format' })
    @Transform(({ value }) => value.toLowerCase()) // Optional: transform email to lowercase
    @ApiProperty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ enum: UserType })
    @IsEnum(UserType, { message: 'Invalid role' })
    role: UserType;
}
