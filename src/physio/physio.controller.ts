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
import { CreatePhysioDto } from './dto/create-physio.dto';
import { UpdateAvatarPhysioDto } from './dto/update-avatar-physio.dto';
import { UpdatePhysioDto } from './dto/update-physio.dto';
import { Physio } from './entities/physio.entity';
import { PhysioService } from './physio.service';

@Controller('physios')
@UseGuards(AuthGuard, RoleGuard)
export class PhysioController {
  constructor(private readonly physioService: PhysioService) {}

  // No pongo @Roles(), ya que a este endpoint pueden acceder todos los tipos de usuarios
  @Get()
  @UseInterceptors(ImageListItemInterceptor)
  findAll(): Promise<Physio[]> {
    return this.physioService.findAll();
  }

  @Get('me')
  @Roles(Role.PHYSIO)
  @UseInterceptors(ImageSingleItemInterceptor)
  findMe(@PersonId() physioId: number): Promise<Physio> {
    console.log(physioId);
    return this.physioService.findOne(physioId);
  }

  // No pongo @Roles(), ya que a este endpoint pueden acceder todos los tipos de usuarios
  @Get('find')
  @UseInterceptors(ImageListItemInterceptor)
  findBySpecialty(@Query('specialty') specialty: string): Promise<Physio[]> {
    if (!specialty) {
      throw new BadRequestException(
        'Specialty parameter is required and can not be empty',
      );
    }

    return this.physioService.findBySpecialty(specialty);
  }

  @Get(':id/appointments')
  @Roles(Role.ADMIN, Role.PHYSIO)
  findPhysioAppointments(@Param('id') id: string): Promise<Appointment[]> {
    checkIfIdIsValid(id);
    return this.physioService.findPhysioAppointments(+id);
  }

  // No pongo @Roles(), ya que a este endpoint pueden acceder todos los tipos de usuarios
  @Get(':id')
  @UseInterceptors(ImageSingleItemInterceptor)
  findOne(@Param('id') id: string): Promise<Physio> {
    checkIfIdIsValid(id);
    return this.physioService.findOne(+id);
  }

  @Post()
  @Roles(Role.ADMIN)
  @UsePipes(ValidationPipe)
  @UseInterceptors(ImageSingleItemInterceptor)
  create(
    @Body('user') userDto: UserDto,
    @Body('physio') createPhysioDto: CreatePhysioDto,
  ): Promise<Physio> {
    return this.physioService.create(createPhysioDto, userDto);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @UsePipes(ValidationPipe)
  @UseInterceptors(ImageSingleItemInterceptor)
  update(
    @Param('id') id: string,
    @Body() updatePhysioDto: UpdatePhysioDto,
  ): Promise<Physio> {
    checkIfIdIsValid(id);
    return this.physioService.update(+id, updatePhysioDto);
  }

  @Put(':id/avatar')
  @Roles(Role.ADMIN)
  @UsePipes(ValidationPipe)
  updateAvatar(
    @Param('id') id: string,
    @Body() updateAvatarPhysioDto: UpdateAvatarPhysioDto,
  ): Promise<string> {
    checkIfIdIsValid(id);
    return this.physioService.updateAvatar(+id, updateAvatarPhysioDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    checkIfIdIsValid(id);
    await this.physioService.remove(+id);
  }
}
