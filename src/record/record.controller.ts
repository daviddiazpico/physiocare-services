import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { checkIfIdIsValid } from 'src/shared/utils/utils';
import { UpdateRecordDto } from './dto/update-record.dto';
import { RecordService } from './record.service';
import { Record } from './entities/record.entity';
import { DetailRecordDto } from './dto/detail-record.dto';

@Controller('records')
@UseGuards(AuthGuard, RoleGuard)
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Get()
  @Roles(Role.ADMIN, Role.PHYSIO)
  findAll(): Promise<Record[]> {
    return this.recordService.findAll();
  }

  @Get('find')
  @Roles(Role.ADMIN, Role.PHYSIO)
  findByPatientSurname(@Query('surname') surname: string): Promise<Record[]> {
    if (!surname) {
      throw new BadRequestException(
        'Surname parameter is required and can not be empty',
      );
    }
    return this.recordService.findByPatientSurname(surname);
  }

  @Get(':id/appointments')
  @Roles(Role.ADMIN, Role.PHYSIO)
  findRecordAppointments(@Param('id') id: string): Promise<Appointment[]> {
    checkIfIdIsValid(id);
    return this.recordService.findRecordAppointments(+id);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.PHYSIO)
  async findOne(@Param('id') id: string): Promise<DetailRecordDto> {
    checkIfIdIsValid(id);
    const record = await this.recordService.findOne(+id);
    return { ...record, appointments: await record.appointments };
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.PHYSIO)
  update(@Param('id') id: string, @Body() updateRecordDto: UpdateRecordDto) {
    checkIfIdIsValid(id);
    return this.recordService.update(+id, updateRecordDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.PHYSIO)
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    checkIfIdIsValid(id);
    await this.recordService.remove(+id);
  }
}
