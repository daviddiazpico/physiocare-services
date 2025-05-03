import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { checkIfIdIsValid } from 'src/shared/utils/utils';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';

@Controller('appointments')
@UseGuards(AuthGuard, RoleGuard)
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  // No pongo @Roles(), ya que a este endpoint pueden acceder todos los tipos de usuarios
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Appointment> {
    checkIfIdIsValid(id);
    return this.appointmentService.findOne(+id);
  }

  // No pongo @Roles(), ya que a este endpoint pueden acceder todos los tipos de usuarios
  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    // revisar si ya esta corfirmado y avisar en caso de que si
    return await this.appointmentService.create(createAppointmentDto);
  }

  @Put(':id/confirm')
  @Roles(Role.ADMIN, Role.PHYSIO)
  @HttpCode(204)
  async confirmAppointment(@Param('id') id: string): Promise<void> {
    checkIfIdIsValid(id);
    await this.appointmentService.confirmAppointment(+id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.PHYSIO)
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    checkIfIdIsValid(id);
    await this.appointmentService.delete(+id);
  }
}
