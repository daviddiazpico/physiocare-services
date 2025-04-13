import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageService } from 'src/shared/services/image.service';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdateAvatarPatientDto } from './dto/update-avatar-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './entities/patient.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>,
    private readonly imageService: ImageService,
    private readonly userService: UserService,
  ) {}

  async #checkIfPatientExists(id: number): Promise<Patient> {
    const patient = await this.patientsRepository.findOneBy({ id });
    if (!patient) {
      throw new NotFoundException(`Patient with id ${id} not found`);
    }

    return patient;
  }

  async #checkIfInsuranceNumberExists(
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

  async #checkIfEmailExists(email: string, patientId = 0): Promise<void> {
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

  async findBySurname(surname: string) {
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
    return this.#checkIfPatientExists(id);
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

  async create(
    createPatientDto: CreatePatientDto,
    userDto: UserDto,
  ): Promise<Patient> {
    await this.#checkIfInsuranceNumberExists(createPatientDto.insuranceNumber);
    await this.#checkIfEmailExists(createPatientDto.email);
    const user = await this.userService.create(userDto);

    const avatarPath = await this.imageService.saveImage(
      'patients',
      createPatientDto.avatar,
    );
    const patient = this.patientsRepository.create(createPatientDto);
    patient.avatar = avatarPath;
    patient.user = user;

    return await this.patientsRepository.save(patient);
  }

  async update(id: number, updatePatientDto: UpdatePatientDto) {
    const patient = await this.#checkIfPatientExists(id);
    await this.#checkIfInsuranceNumberExists(
      updatePatientDto.insuranceNumber,
      updatePatientDto.id,
    );
    await this.#checkIfEmailExists(updatePatientDto.email, updatePatientDto.id);

    for (const property in updatePatientDto) {
      if (property !== 'avatar') {
        patient[property] = updatePatientDto[property];
      }
    }

    return this.patientsRepository.save(patient);
  }

  async updateAvatar(id: number, updatePatientDto: UpdateAvatarPatientDto) {
    const patient = await this.#checkIfPatientExists(id);

    if (updatePatientDto.avatar) {
      const avatarPath = await this.imageService.saveImage(
        'patients',
        updatePatientDto.avatar,
      );
      patient.avatar = avatarPath;
    }

    return this.patientsRepository.save(patient);
  }

  async remove(id: number): Promise<void> {
    await this.#checkIfPatientExists(id);
    await this.patientsRepository.delete(id);
  }
}
