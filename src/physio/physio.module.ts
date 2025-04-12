import { Module } from '@nestjs/common';
import { PhysioService } from './physio.service';
import { PhysioController } from './physio.controller';

@Module({
  controllers: [PhysioController],
  providers: [PhysioService],
})
export class PhysioModule {}
