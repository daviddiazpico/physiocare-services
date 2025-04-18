import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Physio } from 'src/physio/entities/physio.entity';
import { PhysioService } from 'src/physio/physio.service';
import { ImageService } from 'src/shared/services/image.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Patient } from './entities/patient.entity';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { AppointmentService } from 'src/appointment/appointment.service';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { RecordService } from 'src/record/record.service';
import { Record } from 'src/record/entities/record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, User, Physio, Appointment, Record])],
  controllers: [PatientController],
  providers: [PatientService, ImageService, UserService, PhysioService, AppointmentService, RecordService],
})
export class PatientModule {}
