import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PhysioService } from './physio.service';
import { CreatePhysioDto } from './dto/create-physio.dto';
import { UpdatePhysioDto } from './dto/update-physio.dto';

@Controller('physio')
export class PhysioController {
  constructor(private readonly physioService: PhysioService) {}

  @Post()
  create(@Body() createPhysioDto: CreatePhysioDto) {
    return this.physioService.create(createPhysioDto);
  }

  @Get()
  findAll() {
    return this.physioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.physioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePhysioDto: UpdatePhysioDto) {
    return this.physioService.update(+id, updatePhysioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.physioService.remove(+id);
  }
}
