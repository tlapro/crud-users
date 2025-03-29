/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<{ headers: Record<string, string>; user?: any }>();

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
      const decoded = this.jwtService.verify(token, { secret });
      request.user = decoded;
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
