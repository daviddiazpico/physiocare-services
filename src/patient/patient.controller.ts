import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { PersonId } from 'src/shared/decorators/person-id.decorator';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { ImageListItemInterceptor } from 'src/shared/interceptors/image-list-item.interceptor';
import { ImageSingleItemInterceptor } from 'src/shared/interceptors/image-single-item.interceptor';
import { checkIfIdIsValid } from 'src/shared/utils/utils';
import { UserDto } from 'src/user/dto/user.dto';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdateAvatarPatientDto } from './dto/update-avatar-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { PatientService } from './patient.service';
import { DetailPatientDto } from './dto/detail-patient.dto';
import { MeAttributeInterceptor } from 'src/shared/interceptors/me-attribute.interceptor';

@Controller('patients')
@UseGuards(AuthGuard, RoleGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  @Roles(Role.ADMIN, Role.PHYSIO)
  @UseInterceptors(ImageListItemInterceptor)
  findAll(): Promise<Patient[]> {
    return this.patientService.findAll();
  }

  @Get('with-all-data')
  @Roles(Role.ADMIN, Role.PHYSIO)
  @UseInterceptors(ImageListItemInterceptor)
  async findAllWithAllData(): Promise<DetailPatientDto[]> {
    const patients = await this.patientService.findAll();
    const patientsWithAllData: DetailPatientDto[] = [];
    for (const p of patients) {
      patientsWithAllData.push({
        ...p,
        appointments: await p.appointments,
        record: await p.record,
      });
    }
    return patientsWithAllData;
  }

  @Get('me')
  @Roles(Role.PATIENT)
  @UseInterceptors(ImageSingleItemInterceptor, MeAttributeInterceptor)
  async findMe(@PersonId() patientId: number): Promise<DetailPatientDto> {
    const patient = await this.patientService.findOne(patientId);
    return {
      ...patient,
      appointments: await patient.appointments,
      record: await patient.record,
    };
  }

  @Get('find')
  @Roles(Role.ADMIN, Role.PHYSIO)
  @UseInterceptors(ImageListItemInterceptor)
  findBySurname(@Query('surname') surname: string): Promise<Patient[]> {
    if (!surname) {
      throw new BadRequestException(
        'Surname parameter is required and can not be empty',
      );
    }
    return this.patientService.findBySurname(surname);
  }

  // No pongo @Roles(), ya que a este endpoint pueden acceder todos los tipos de usuarios
  @Get(':id/appointments')
  findPatientAppointments(@Param('id') id: string): Promise<Appointment[]> {
    checkIfIdIsValid(id);
    return this.patientService.findPatientAppointments(+id);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.PHYSIO)
  @UseInterceptors(ImageSingleItemInterceptor, MeAttributeInterceptor)
  async findOne(@Param('id') id: string): Promise<DetailPatientDto> {
    checkIfIdIsValid(id);
    const patient = await this.patientService.findOne(+id);
    return {
      ...patient,
      appointments: await patient.appointments,
      record: await patient.record,
    };
  }

  @Post()
  @Roles(Role.ADMIN, Role.PHYSIO)
  @UsePipes(ValidationPipe)
  @UseInterceptors(ImageSingleItemInterceptor)
  create(
    @Body('user') userDto: UserDto,
    @Body('patient') createPatientDto: CreatePatientDto,
  ): Promise<Patient> {
    return this.patientService.create(createPatientDto, userDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.PHYSIO)
  @UsePipes(ValidationPipe)
  @UseInterceptors(ImageSingleItemInterceptor)
  update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    checkIfIdIsValid(id);
    return this.patientService.update(+id, updatePatientDto);
  }

  // No pongo @Roles(), ya que a este endpoint pueden acceder todos los tipos de usuarios
  @Put(':id/avatar')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ImageSingleItemInterceptor)
  updateAvatar(
    @Param('id') id: string,
    @Body() updateAvatarPatientDto: UpdateAvatarPatientDto,
  ): Promise<string> {
    checkIfIdIsValid(id);
    return this.patientService.updateAvatar(+id, updateAvatarPatientDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.PHYSIO)
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    checkIfIdIsValid(id);
    await this.patientService.remove(+id);
  }
}
