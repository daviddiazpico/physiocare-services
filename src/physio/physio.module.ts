import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentService } from 'src/appointment/appointment.service';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Patient } from 'src/patient/entities/patient.entity';
import { PatientService } from 'src/patient/patient.service';
import { Record } from 'src/record/entities/record.entity';
import { RecordService } from 'src/record/record.service';
import { FirebaseService } from 'src/shared/services/firebase.service';
import { ImageService } from 'src/shared/services/image.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Physio } from './entities/physio.entity';
import { PhysioController } from './physio.controller';
import { PhysioService } from './physio.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Physio, User, Appointment, Patient, Record]),
  ],
  controllers: [PhysioController],
  providers: [
    PhysioService,
    UserService,
    ImageService,
    AppointmentService,
    PatientService,
    RecordService,
    FirebaseService,
  ],
})
export class PhysioModule {}
