import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
import { User } from 'src/typeorm/entities/User';

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(Blog)
        private readonly blogRepository: Repository<Blog>,
    ) {}

    async findAll(): Promise<Blog[]> {
        return this.blogRepository.find();
    }

    async findOne(id: number): Promise<Blog> {
        const blog = await this.blogRepository.findOne({ where: { id } });
        if (!blog) {
            throw new NotFoundException('Blog post not found');
        }
        return blog;
    }

    async create(user: User, createBlogDto: CreateBlogDto, image: any): Promise<Blog> {
        console.log(image);
        const { title, content } = createBlogDto;
        const blog = this.blogRepository.create({
            title,
            content,
            createdBy: user,
            image: image.filename,
        });
        return this.blogRepository.save(blog);
    }

    async update(id: number, updateBlogDto: UpdateBlogDto): Promise<Blog> {
        const blog = await this.findOne(id);
        const { title, content } = updateBlogDto;
        blog.title = title ?? blog.title;
        blog.content = content ?? blog.content;
        return this.blogRepository.save(blog);
    }

    async remove(id: number): Promise<void> {
        const blog = await this.findOne(id);
        await this.blogRepository.remove(blog);
    }
}
