import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const PersonId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request['userdata'].id;
  },
);
