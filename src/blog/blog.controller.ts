import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiBearerAuth()
@ApiTags('Blogs')
@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) {}

    @Post()
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                content: { type: 'string' },
            },
        },
    })
    async create(@Req() req: Request, @Body() createBlogDto: CreateBlogDto) {
        const createdBy = req['user'].sub;
        await this.blogService.create(createdBy, createBlogDto);
    }

    @Get()
    async findAll() {
        return this.blogService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.blogService.findOne(+id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateBlogDto: UpdateBlogDto,
    ) {
        return this.blogService.update(+id, updateBlogDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.blogService.remove(+id);
    }
}
