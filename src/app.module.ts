import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppointmentModule } from './appointment/appointment.module';
import { Appointment } from './appointment/entities/appointment.entity';
import { AuthModule } from './auth/auth.module';
import { ImageService } from './shared/services/image.service';
import { Patient } from './patient/entities/patient.entity';
import { PatientModule } from './patient/patient.module';
import { Physio } from './physio/entities/physio.entity';
import { PhysioModule } from './physio/physio.module';
import { Record } from './record/entities/record.entity';
import { RecordModule } from './record/record.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      password: process.env.DB_PASSWORD,
      username: process.env.DB_USER,
      entities: [User, Patient, Physio, Record, Appointment],
      database: process.env.DB_NAME,
      synchronize: true, // mirar lo de solo desarrollo
      logging: true, // solo en desarrollo mirar tambien
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
