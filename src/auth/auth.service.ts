import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Patient } from 'src/patient/entities/patient.entity';
import { PatientService } from 'src/patient/patient.service';
import { Physio } from 'src/physio/entities/physio.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly patientService: PatientService,
  ) {}

  async login(username: string, password: string): Promise<string> {
    const user = await this.userService.findOne(username, password);

    let personAssociated!: Patient | Physio;
    if (user.rol === 'patient') {
      personAssociated = await this.patientService.findOneByUser(user);
    } else if (user.rol === 'physio') {
      // TO-DO(Obtener el fisio)
    }

    const token = this.jwtService.sign(
      {
        username: user.username,
        rol: user.rol,
        id: personAssociated.id,
      },
      { secret: process.env.JWT_SECRET_WORD },
    );
    return token;
  }
}
