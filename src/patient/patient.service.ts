import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecordService } from 'src/record/record.service';
import { ImageService } from 'src/shared/services/image.service';
import { UserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdateAvatarPatientDto } from './dto/update-avatar-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>,
    private readonly imageService: ImageService,
    private readonly userService: UserService,
    private readonly recordService: RecordService,
  ) {}

  async checkIfPatientExists(id: number): Promise<Patient> {
    const patient = await this.patientsRepository.findOneBy({ id });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  private async checkIfInsuranceNumberExists(
    insuranceNumber: string,
    patientId = 0,
  ): Promise<void> {
    const patient = await this.patientsRepository.findOneBy({
      insuranceNumber,
    });
    if (patient && patient.id !== patientId) {
      throw new BadRequestException(
        `The insurance number '${insuranceNumber}' is assigned to other patient`,
      );
    }
  }

  private async checkIfEmailExists(
    email: string,
    patientId = 0,
  ): Promise<void> {
    const patient = await this.patientsRepository.findOneBy({ email });
    if (patient && patient.id !== patientId) {
      throw new BadRequestException(
        `The email '${email}' is assigned to other patient`,
      );
    }
  }

  async findAll(): Promise<Patient[]> {
    const patients = await this.patientsRepository.find();
    if (!patients) {
      throw new NotFoundException(
        "There aren't patients registered in the system",
      );
    }

    return patients;
  }

  async findBySurname(surname: string): Promise<Patient[]> {
    const patients = await this.patientsRepository
      .createQueryBuilder()
      .where('surname LIKE :surname', { surname: `%${surname}%` })
      .getMany();

    if (patients.length === 0) {
      throw new NotFoundException('No patients found');
    }

    return patients;
  }

  findOne(id: number): Promise<Patient> {
    return this.checkIfPatientExists(id);
  }

  /**
   * Method to search patient by User. I used it in the AuthService to get the patient
   * associated with the user who logs in, to store their id in the token
   *
   * @param user The user associated to the patient
   * @returns The patient associated with the user received
   */
  async findOneByUser(user: User): Promise<Patient> {
    return (await this.patientsRepository.findOneBy({ user }))!;
  }

  // revisar la transacion aqui, ya que si peta conexion o algo asi
  // podria guardarse un usuario y no el patient
  // posible pruaba poner los campos lat lng sin default, para que sea null
  // cuando se inserte, pero el user ya estara
  async create(
    createPatientDto: CreatePatientDto,
    userDto: UserDto,
  ): Promise<Patient> {
    await this.checkIfInsuranceNumberExists(createPatientDto.insuranceNumber);
    await this.checkIfEmailExists(createPatientDto.email);
    const user = await this.userService.create(userDto);

    let avatarPath = 'images/patients/patient_default.jpg';
    if (createPatientDto.avatar) {
      avatarPath = await this.imageService.saveImage(
        'patients',
        createPatientDto.avatar,
      );
    }

    const patient = this.patientsRepository.create(createPatientDto);
    patient.avatar = avatarPath;
    patient.user = user;

    const patientSaved = await this.patientsRepository.save(patient);
    await this.recordService.create(patientSaved);
    return patientSaved;
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    const patient = await this.checkIfPatientExists(id);
    await this.checkIfInsuranceNumberExists(
      updatePatientDto.insuranceNumber,
      id,
    );
    await this.checkIfEmailExists(updatePatientDto.email, id);

    for (const property in updatePatientDto) {
      if (property !== 'avatar') {
        patient[property] = updatePatientDto[property];
      }
    }

    return this.patientsRepository.save(patient);
  }

  // falta el endpoitn de update avatar en patient y physio
  async updateAvatar(
    id: number,
    updateAvatarPatientDto: UpdateAvatarPatientDto,
  ): Promise<string> {
    const patient = await this.checkIfPatientExists(id);

    if (updateAvatarPatientDto.avatar) {
      const avatarPath = await this.imageService.saveImage(
        'patients',
        updateAvatarPatientDto.avatar,
      );
      patient.avatar = avatarPath;
    }

    return (await this.patientsRepository.save(patient)).avatar;
  }

  async remove(id: number): Promise<void> {
    await this.checkIfPatientExists(id);
    await this.patientsRepository.delete(id);
  }
}
