import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppointmentService } from 'src/appointment/appointment.service';
import { CreateAppointmentDto } from 'src/appointment/dto/create-appointment.dto';
import { PersonId } from 'src/shared/decorators/person-id.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UserDto } from 'src/user/dto/user.dto';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { PatientService } from './patient.service';
import { Appointment } from 'src/appointment/entities/appointment.entity';

@Controller('patients')
@UseGuards(AuthGuard)
// @UseInterceptors(ImageInterceptor) mirar donde poner si en tdo el controller o endpoints especificos
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
    private readonly appointmentService: AppointmentService,
  ) {}

  @Get()
  findAll() {
    return this.patientService.findAll();
  }

  @Get('me')
  findMe(@PersonId() patientId: number) {
    return this.patientService.findOne(patientId);
  }

  @Get('find')
  findBySurname(@Query('surname') surname: string) {
    if (!surname) {
      throw new BadRequestException(
        'Surname parameter is required and can not be empty',
      );
    }
    return this.patientService.findBySurname(surname);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!id.match(/^\d+$/)) {
      throw new BadRequestException('ID must be a number');
    }
    return this.patientService.findOne(+id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Body('user') userDto: UserDto,
    @Body('patient') createPatientDto: CreatePatientDto,
  ): Promise<Patient> {
    return await this.patientService.create(createPatientDto, userDto);
  }

  @Post('appointments')
  @UsePipes(ValidationPipe)
  async createAppointment(
    @PersonId() patientId: number,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const patient = await this.patientService.findOne(patientId);
    return this.appointmentService.create(createAppointmentDto, patient);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    if (!id.match(/^\d+$/)) {
      throw new BadRequestException('ID must be a number');
    }
    return this.patientService.update(+id, updatePatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!id.match(/^\d+$/)) {
      throw new BadRequestException('ID must be a number');
    }
    return this.patientService.remove(+id);
  }
}
