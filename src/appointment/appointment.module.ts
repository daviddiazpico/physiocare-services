import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { PhysioService } from 'src/physio/physio.service';
import { Physio } from 'src/physio/entities/physio.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ImageService } from 'src/shared/services/image.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, User, Physio])],
  providers: [AppointmentService, PhysioService, UserService, ImageService]
})
export class AppointmentModule {}
