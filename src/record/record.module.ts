import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from 'src/patient/entities/patient.entity';
import { User } from 'src/user/entities/user.entity';
import { Record } from './entities/record.entity';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';

@Module({
  imports: [TypeOrmModule.forFeature([Record, Patient, User])],
  controllers: [RecordController],
  providers: [RecordService],
})
export class RecordModule {}
