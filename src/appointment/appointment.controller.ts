import { Controller, Param, Put } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { checkIfIdIsValid } from 'src/shared/utils/utils';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Put(':id/confirm')
  async confirmAppointment(@Param('id') id: string): Promise<void> {
    checkIfIdIsValid(id);
    await this.appointmentService.confirmAppointment(+id);
  }
}
