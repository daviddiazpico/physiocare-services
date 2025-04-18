import { Module } from '@nestjs/common';
import { PhysioService } from './physio.service';
import { PhysioController } from './physio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Physio } from './entities/physio.entity';
import { User } from 'src/user/entities/user.entity';
import { ImageService } from 'src/shared/services/image.service';
import { UserService } from 'src/user/user.service';
import { AppointmentService } from 'src/appointment/appointment.service';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Patient } from 'src/patient/entities/patient.entity';
import { PatientService } from 'src/patient/patient.service';
import { Record } from 'src/record/entities/record.entity';
import { RecordService } from 'src/record/record.service';

@Module({
  imports: [TypeOrmModule.forFeature([Physio, User, Appointment, Patient, Record])],
  controllers: [PhysioController],
  providers: [PhysioService, UserService, ImageService, AppointmentService, PatientService, RecordService],
})
export class PhysioModule {}
