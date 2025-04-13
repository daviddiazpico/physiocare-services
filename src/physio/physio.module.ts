import { Module } from '@nestjs/common';
import { PhysioService } from './physio.service';
import { PhysioController } from './physio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Physio } from './entities/physio.entity';
import { User } from 'src/user/entities/user.entity';
import { ImageService } from 'src/shared/services/image.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Physio, User])],
  controllers: [PhysioController],
  providers: [PhysioService, UserService, ImageService],
})
export class PhysioModule {}
