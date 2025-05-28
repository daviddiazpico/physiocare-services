import { IsNumber, IsOptional } from 'class-validator';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends CreateAppointmentDto {
  @IsNumber({}, { message: 'ID must be a number' })
  @IsOptional()
  id: number;
}
