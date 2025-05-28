import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { DetailPatientDto } from 'src/patient/dto/detail-patient.dto';
import { DetailPhysioDto } from 'src/physio/dto/detail-physio.dto';

@Injectable()
export class MeAttributeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<DetailPatientDto | DetailPhysioDto> {
    const req = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map((data: DetailPatientDto | DetailPhysioDto) => {
        if ('insuranceNumber' in data) {
          return {
            ...data,
            me:
              req['userdata'].rol === 'patient' &&
              data.id === req['userdata'].id,
          };
        } else {
          return {
            ...data,
            me:
              req['userdata'].rol === 'physio' &&
              data.id === req['userdata'].id,
          };
        }
      }),
    );
  }
}
