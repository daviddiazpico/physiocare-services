import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageService } from 'src/shared/services/image.service';
import { Patient } from 'src/patient/entities/patient.entity';
import { PatientService } from 'src/patient/patient.service';
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
    TypeOrmModule.forFeature([Patient]),
  ],
  controllers: [AuthController],
  providers: [AuthService, PatientService, ImageService],
})
export class AuthModule {}
