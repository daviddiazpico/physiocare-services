import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePhysioDto } from './dto/create-physio.dto';
import { UpdatePhysioDto } from './dto/update-physio.dto';
import { PhysioService } from './physio.service';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { UserDto } from 'src/user/dto/user.dto';

@Controller('physios')
@UseGuards(AuthGuard)
export class PhysioController {
  constructor(private readonly physioService: PhysioService) {}

  @Get()
  findAll() {
    return this.physioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.physioService.findOne(+id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(
    @Body('user') userDto: UserDto,
    @Body('physio') createPhysioDto: CreatePhysioDto,
  ) {
    return this.physioService.create(createPhysioDto, userDto);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() updatePhysioDto: UpdatePhysioDto) {
    return this.physioService.update(+id, updatePhysioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.physioService.remove(+id);
  }
}
