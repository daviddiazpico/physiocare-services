import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { UpdateRecordDto } from './dto/update-record.dto';
import { RecordService } from './record.service';
import { checkIfIdIsValid } from 'src/shared/utils/utils';

@Controller('records')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Get()
  findAll() {
    return this.recordService.findAll();
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
  remove(@Param('id') id: string) {
    checkIfIdIsValid(id);
    return this.recordService.remove(+id);
  }
}
