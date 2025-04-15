import { Body, Controller, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { checkIfIdIsValid } from 'src/shared/utils/utils';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    // revisar si ya esta corfirmado y avisar en caso de que si
    return await this.appointmentService.create(createAppointmentDto);
  }

  @Put(':id/confirm')
  async confirmAppointment(@Param('id') id: string): Promise<void> {
    checkIfIdIsValid(id);
    await this.appointmentService.confirmAppointment(+id);
  }
}
