import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class XPermittedCrossDomainPoliciesMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
        next();
    }
}
