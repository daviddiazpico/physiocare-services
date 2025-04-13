import { IsNumber } from 'class-validator';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends CreateAppointmentDto {
  @IsNumber({}, { message: 'ID must be a number' })
  id: number;
}
