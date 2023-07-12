import { Injectable, Post } from '@nestjs/common';
import { TRANSCODE_QUEUE } from './utils/constants';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class AppService {
    constructor(
        @InjectQueue(TRANSCODE_QUEUE) private readonly transcodeQueue: Queue,
    ) {}
    getHello(): string {
        return 'Hello World!';
    }
    async transcode() {
        await this.transcodeQueue.add({
            fileName: './file.mp3',
        });
    }
}
