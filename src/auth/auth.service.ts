import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Patient } from 'src/patient/entities/patient.entity';
import { PatientService } from 'src/patient/patient.service';
import { Physio } from 'src/physio/entities/physio.entity';
import { PhysioService } from 'src/physio/physio.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly patientService: PatientService,
    private readonly physioService: PhysioService,
  ) {}

  async login(username: string, password: string): Promise<string> {
    const user = await this.userService.findOne(username, password);

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
        id: personAssociated? personAssociated.id:'',
      },
      { secret: process.env.JWT_SECRET_WORD },
    );
    return token;
  }
}
