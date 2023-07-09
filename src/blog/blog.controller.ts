import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/services/multer.config';

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
                image: { type: 'string', format: 'binary' },
            },
        },
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image', multerOptions))
    async create(
        @Req() req: Request,
        @Body() createBlogDto: CreateBlogDto,
        @UploadedFile() image,
    ) {
        console.log(multerOptions);
        const createdBy = req['user'].sub;
        await this.blogService.create(createdBy, createBlogDto, image);
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
