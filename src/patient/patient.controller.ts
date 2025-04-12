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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserDto } from 'src/user/dto/user.dto';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { PatientService } from './patient.service';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  findAll() {
    return this.patientService.findAll();
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
      throw new BadRequestException('id must be a number');
    }
    return this.patientService.findOne(+id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Body('user') userDto: UserDto,
    @Body('patient') createPatientDto: CreatePatientDto,
  ): Promise<Patient> {
    return this.patientService.create(createPatientDto, userDto);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    if (!id.match(/^\d+$/)) {
      throw new BadRequestException('id must be a number');
    }
    return this.patientService.update(+id, updatePatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!id.match(/^\d+$/)) {
      throw new BadRequestException('id must be a number');
    }
    return this.patientService.remove(+id);
  }
}
