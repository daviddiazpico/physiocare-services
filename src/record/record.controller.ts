import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { checkIfIdIsValid } from 'src/shared/utils/utils';
import { UpdateRecordDto } from './dto/update-record.dto';
import { RecordService } from './record.service';
import { Appointment } from 'src/appointment/entities/appointment.entity';

@Controller('records')
@UseGuards(AuthGuard)
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Get()
  findAll() {
    return this.recordService.findAll();
  }

  @Get(':id/appointments')
  findRecordAppointments(@Param('id') id: string): Promise<Appointment[]> {
    checkIfIdIsValid(id);
    return this.recordService.findRecordAppointments(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    checkIfIdIsValid(id);
    return this.recordService.findOne(+id);
  }

  // @Post()
  // create(@Body() createRecordDto: CreateRecordDto) {
  //   return this.recordService.create(createRecordDto);
  // }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateRecordDto: UpdateRecordDto) {
    checkIfIdIsValid(id);
    return this.recordService.update(+id, updateRecordDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    checkIfIdIsValid(id);
    await this.recordService.remove(+id);
  }
}
