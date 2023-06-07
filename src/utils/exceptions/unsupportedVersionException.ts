import { HttpException, HttpStatus } from '@nestjs/common';

export class UnsupportedVersionException extends HttpException {
    constructor() {
        super('Unsupported API version', HttpStatus.BAD_REQUEST);
    }
}
