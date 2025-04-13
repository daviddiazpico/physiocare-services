import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { ImageService } from 'src/shared/services/image.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { AppointmentService } from 'src/appointment/appointment.service';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { PhysioService } from 'src/physio/physio.service';
import { Physio } from 'src/physio/entities/physio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, User, Appointment, Physio])],
  controllers: [PatientController],
  providers: [PatientService, ImageService, UserService, AppointmentService, PhysioService],
})
export class PatientModule {}
