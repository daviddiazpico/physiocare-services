import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Patient } from 'src/patient/entities/patient.entity';
import { PatientService } from 'src/patient/patient.service';
import { Physio } from 'src/physio/entities/physio.entity';
import { PhysioService } from 'src/physio/physio.service';
import { UserService } from 'src/user/user.service';
import { UserLogin } from './interfaces/user-login.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly patientService: PatientService,
    private readonly physioService: PhysioService,
  ) {}

  validate(token: string): boolean {
    try {
      this.jwtService.verify(token, { secret: process.env.JWT_SECRET_WORD });
      return true;
    } catch {
      return false;
    }
  }

  async login(userLogin: UserLogin): Promise<{ token: string; rol: string }> {
    const user = await this.userService.findOne(
      userLogin.username,
      userLogin.password,
    );

    if (userLogin.firebaseToken) {
      user.firebaseToken = userLogin.firebaseToken;
      await this.userService.save(user);
    }

    let personAssociated!: Patient | Physio;
    if (user.rol === 'patient') {
      personAssociated = await this.patientService.findOneByUser(user);
    } else if (user.rol === 'physio') {
      personAssociated = await this.physioService.findOneByUser(user);
    }

    const token = this.jwtService.sign(
      {
        username: user.username,
        rol: user.rol,
        id: personAssociated ? personAssociated.id : '',
      },
      { secret: process.env.JWT_SECRET_WORD },
    );
    return { token: token, rol: user.rol };
  }

  async deleteFirebaseToken(username: string): Promise<void> {
    await this.userService.deleteFirebaseTokenByUsername(username);
  }
}
