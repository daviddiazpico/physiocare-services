import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Patient } from 'src/patient/entities/patient.entity';
import { Physio } from 'src/physio/entities/physio.entity';

@Injectable()
export class ImageInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Patient | Physio> {
    return next.handle().pipe(
      map((data: Patient | Physio) => {
        return {
          ...data,
          avatar: process.env.BASE_PATH + data.avatar,
        };
      }),
    );
  }
}
