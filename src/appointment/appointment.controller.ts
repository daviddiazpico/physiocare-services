import { Body, Controller, Delete, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { checkIfIdIsValid } from 'src/shared/utils/utils';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@Controller('appointments')
@UseGuards(AuthGuard)
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

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    checkIfIdIsValid(id);
    await this.appointmentService.delete(+id);
  }
}
