import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Physio } from 'src/physio/entities/physio.entity';
import { PhysioService } from 'src/physio/physio.service';
import { Record } from 'src/record/entities/record.entity';
import { RecordService } from 'src/record/record.service';
import { ImageService } from 'src/shared/services/image.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Patient } from './entities/patient.entity';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, User, Physio, Record])],
  controllers: [PatientController],
  providers: [PatientService, ImageService, UserService, PhysioService, RecordService],
})
export class PatientModule {}
