import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Language } from './interfaces';

export const Lang = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const language: Language = request.headers['x-lang'];
    return language || Language.uz;
  },
);
