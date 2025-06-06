import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentService } from 'src/appointment/appointment.service';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Patient } from 'src/patient/entities/patient.entity';
import { PatientService } from 'src/patient/patient.service';
import { Physio } from 'src/physio/entities/physio.entity';
import { PhysioService } from 'src/physio/physio.service';
import { Record } from 'src/record/entities/record.entity';
import { RecordService } from 'src/record/record.service';
import { FirebaseService } from 'src/shared/services/firebase.service';
import { ImageService } from 'src/shared/services/image.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_WORD,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([Patient, Physio, Record, Appointment]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PatientService,
    PhysioService,
    ImageService,
    RecordService,
    AppointmentService,
    FirebaseService,
  ],
})
export class AuthModule {}
