import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class XDnsPrefetchControlMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        res.setHeader('X-DNS-Prefetch-Control', 'on');
        next();
    }
}
