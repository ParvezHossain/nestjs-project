import { Injectable } from '@nestjs/common';
import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class NotFoundMiddleware implements NestMiddleware {
    use(req: Request, res: Response, _next: NextFunction) {
        res.status(404).json({ message: 'API Not Found' });
    }
}
