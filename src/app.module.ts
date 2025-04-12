import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientModule } from './patient/patient.module';
import { PhysioModule } from './physio/physio.module';
import { RecordModule } from './record/record.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './patient/entities/patient.entity';
import { Physio } from './physio/entities/physio.entity';
import { Record } from './record/entities/record.entity';
import { User } from './user/entities/user.entity';
import { AppointmentModule } from './appointment/appointment.module';
import { Appointment } from './appointment/entities/appointment.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ImageService } from './commons/image/image.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USER,
      entities: [User, Patient, Physio, Record, Appointment],
      database: process.env.DB_NAME,
      synchronize: true, // mirar lo de solo desarrollo
      logging: true,
    }),
    PatientModule,
    PhysioModule,
    RecordModule,
    UserModule,
    AppointmentModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, ImageService],
})
export class AppModule {}
