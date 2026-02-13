import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class IsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const authorization = req.headers['authorization'];
    if (!authorization) throw new UnauthorizedException('Permission denied');

    const [type, token] = authorization.split(' ');
    if (!token) throw new UnauthorizedException('Permission denied');

    try {
      const payload = this.jwtService.verify(token);
      req['userId'] = payload.userId;
      req['role'] = payload.role;
      return true;
    } catch {
      throw new UnauthorizedException('Permission denied');
    }
  }
}
