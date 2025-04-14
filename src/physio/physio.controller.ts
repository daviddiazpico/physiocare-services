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

  @Get('find')
  findBySpecialty(@Query('specialty') specialty: string) {
    if (!specialty) {
      throw new BadRequestException(
        'Specialty parameter is required and can not be empty',
      );
    }

    return this.physioService.findBySpecialty(specialty);
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
    if (!id.match(/^\d+$/)) {
      throw new BadRequestException('ID must be a number');
    }
    return this.physioService.update(+id, updatePhysioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!id.match(/^\d+$/)) {
      throw new BadRequestException('ID must be a number');
    }
    return this.physioService.remove(+id);
  }
}
