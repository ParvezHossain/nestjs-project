import {
    ArgumentsHost,
    ExceptionFilter,
    NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

export class NotFoundFilter implements ExceptionFilter {
    catch(exception: NotFoundException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        response.status(404).json({ message: 'Custom Not Found' });
    }
}
