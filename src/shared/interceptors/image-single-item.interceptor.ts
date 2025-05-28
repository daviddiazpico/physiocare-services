import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ImageSingleItemInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (typeof data === 'string') {
          return { avatar: process.env.BASE_PATH + data };
        }
        return {
          ...data,
          avatar: process.env.BASE_PATH + data.avatar,
        };
      }),
    );
  }
}
