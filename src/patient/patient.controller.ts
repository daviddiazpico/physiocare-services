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
import { PersonId } from 'src/shared/decorators/person-id.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { checkIfIdIsValid } from 'src/shared/utils/utils';
import { UserDto } from 'src/user/dto/user.dto';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdateAvatarPatientDto } from './dto/update-avatar-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { PatientService } from './patient.service';

@Controller('patients')
@UseGuards(AuthGuard)
// @UseInterceptors(ImageInterceptor) mirar donde poner si en tdo el controller o endpoints especificos
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
  ) {}

  @Get()
  findAll(): Promise<Patient[]> {
    return this.patientService.findAll();
  }

  @Get('me')
  findMe(@PersonId() patientId: number): Promise<Patient> {
    return this.patientService.findOne(patientId);
  }

  @Get('find')
  findBySurname(@Query('surname') surname: string): Promise<Patient[]> {
    if (!surname) {
      throw new BadRequestException(
        'Surname parameter is required and can not be empty',
      );
    }
    return this.patientService.findBySurname(surname);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Patient> {
    checkIfIdIsValid(id);
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

  @Put(':id')
  @UsePipes(ValidationPipe)
  update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    checkIfIdIsValid(id);
    return this.patientService.update(+id, updatePatientDto);
  }

  @Put(':id/avatar')
  @UsePipes(ValidationPipe)
  updateAvatar(
    @Param('id') id: string,
    @Body() updateAvatarPatientDto: UpdateAvatarPatientDto,
  ): Promise<string> {
    checkIfIdIsValid(id);
    return this.patientService.updateAvatar(+id, updateAvatarPatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    checkIfIdIsValid(id);
    return this.patientService.remove(+id);
  }
}
