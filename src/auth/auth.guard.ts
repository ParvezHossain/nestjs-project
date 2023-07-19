import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from './constants';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) {}

    /** In the canActivate method, the guard first checks if the route or handler
     * has been marked as public using the IS_PUBLIC_KEY decorator. If it is public,
     * access is granted without further authentication. Otherwise, it extracts the
     * JWT token from the request's authorization header, verifies it using the
     * JwtService, and attaches the authenticated user's payload to the request object.
     * */

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret,
            });
            request['user'] = payload;
            // Here we add the custom header to set the user ROLE to get.
            request.headers.user = payload;
        } catch (error) {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string {
        const authorizationHeader = request.headers.authorization;
        if (!authorizationHeader) {
            throw new UnauthorizedException();
        }

        const [type, token] = authorizationHeader.split(' ');
        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException();
        }

        return token;
    }
}
