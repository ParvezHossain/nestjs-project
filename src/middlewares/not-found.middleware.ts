/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { NestMiddleware } from '@nestjs/common';

@Injectable()
export class NotFoundMiddleware implements NestMiddleware {
  use(req: any, res: any, _next: (error?: any) => void) {
    res.status(404).json({ message: 'Not Found' });
  }
}
