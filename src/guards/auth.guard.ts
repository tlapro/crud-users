import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }
    if (typeof authHeader !== 'string') {
      throw new UnauthorizedException('Authorization header must be a string');
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new BadRequestException(
        'Invalid authorization header format. Expected "Bearer <token>".',
      );
    }
    const token = parts[1];
    try {
      const secret = process.env.JWT_SECRET;
      this.jwtService.verify(token, { secret });
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          error.message || 'Ocurrió un error inesperado',
        );
      } else {
        throw new BadRequestException('Ocurrió un error inesperado');
      }
    }
  }
}
