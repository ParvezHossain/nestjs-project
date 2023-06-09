import { PartialType } from '@nestjs/swagger';
import { CreateBlogDto } from './create-blog.dto';
import { IsOptional, IsNotEmpty, IsString } from 'class-validator';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    title?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    content?: string;
}
