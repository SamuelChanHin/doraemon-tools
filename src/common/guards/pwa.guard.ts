import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class PwaGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const mode = req.headers['mode']; // checks the header, moves to query if null

      return mode === 'standalone';
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
