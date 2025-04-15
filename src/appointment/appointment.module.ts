import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { PhysioService } from 'src/physio/physio.service';
import { Physio } from 'src/physio/entities/physio.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { ImageService } from 'src/shared/services/image.service';
import { RecordService } from 'src/record/record.service';
import { AppointmentController } from './appointment.controller';
import { Record } from 'src/record/entities/record.entity';
import { PatientService } from 'src/patient/patient.service';
import { Patient } from 'src/patient/entities/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, User, Patient, Physio, Record])],
  controllers: [AppointmentController],
  providers: [
    AppointmentService,
    PhysioService,
    PatientService,
    UserService,
    ImageService,
    RecordService,
  ],
})
export class AppointmentModule {}
