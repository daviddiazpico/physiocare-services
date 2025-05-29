import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentService } from 'src/appointment/appointment.service';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Patient } from 'src/patient/entities/patient.entity';
import { PatientService } from 'src/patient/patient.service';
import { Physio } from 'src/physio/entities/physio.entity';
import { PhysioService } from 'src/physio/physio.service';
import { FirebaseService } from 'src/shared/services/firebase.service';
import { ImageService } from 'src/shared/services/image.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Record } from './entities/record.entity';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Record, Patient, User, Appointment, Physio]),
  ],
  controllers: [RecordController],
  providers: [
    RecordService,
    AppointmentService,
    PhysioService,
    PatientService,
    UserService,
    ImageService,
    FirebaseService,
  ],
})
export class RecordModule {}
