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
import { CreatePhysioDto } from './dto/create-physio.dto';
import { UpdateAvatarPhysioDto } from './dto/update-avatar-physio.dto';
import { UpdatePhysioDto } from './dto/update-physio.dto';
import { Physio } from './entities/physio.entity';
import { PhysioService } from './physio.service';
import { Appointment } from 'src/appointment/entities/appointment.entity';

@Controller('physios')
@UseGuards(AuthGuard)
export class PhysioController {
  constructor(private readonly physioService: PhysioService) {}

  @Get()
  findAll(): Promise<Physio[]> {
    return this.physioService.findAll();
  }

  @Get('me')
  findMe(@PersonId() physioId: number): Promise<Physio> {
    console.log(physioId);
    return this.physioService.findOne(physioId);
  }

  @Get('find')
  findBySpecialty(@Query('specialty') specialty: string): Promise<Physio[]> {
    if (!specialty) {
      throw new BadRequestException(
        'Specialty parameter is required and can not be empty',
      );
    }

    return this.physioService.findBySpecialty(specialty);
  }

  @Get(':id/appointments')
  findPhysioAppointments(@Param('id') id: string): Promise<Appointment[]> {
    checkIfIdIsValid(id);
    return this.physioService.findPhysioAppointments(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Physio> {
    checkIfIdIsValid(id);
    return this.physioService.findOne(+id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(
    @Body('user') userDto: UserDto,
    @Body('physio') createPhysioDto: CreatePhysioDto,
  ): Promise<Physio> {
    return this.physioService.create(createPhysioDto, userDto);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  update(
    @Param('id') id: string,
    @Body() updatePhysioDto: UpdatePhysioDto,
  ): Promise<Physio> {
    checkIfIdIsValid(id);
    return this.physioService.update(+id, updatePhysioDto);
  }

  @Put(':id/avatar')
  @UsePipes(ValidationPipe)
  updateAvatar(
    @Param('id') id: string,
    @Body() updateAvatarPhysioDto: UpdateAvatarPhysioDto,
  ): Promise<string> {
    checkIfIdIsValid(id);
    return this.physioService.updateAvatar(+id, updateAvatarPhysioDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    checkIfIdIsValid(id);
    await this.physioService.remove(+id);
  }
}
