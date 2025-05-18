import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Record } from 'src/record/entities/record.entity';
import { ImageService } from 'src/shared/services/image.service';
import { UserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { DataSource, Repository } from 'typeorm';
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
    private readonly dataSource: DataSource,
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
      .where('surname ILIKE :surname', { surname: `%${surname}%` })
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

  async findPatientAppointments(id: number): Promise<Appointment[]> {
    const appointments = await (await this.findOne(id)).appointments;
    if (appointments.length === 0) {
      throw new NotFoundException(
        'This patient does not have any appointment associated',
      );
    }

    return appointments;
  }

  async create(
    createPatientDto: CreatePatientDto,
    userDto: UserDto,
  ): Promise<Patient> {
    await this.userService.checkIfUsernameExists(userDto.username);
    await this.checkIfInsuranceNumberExists(createPatientDto.insuranceNumber);
    await this.checkIfEmailExists(createPatientDto.email);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = User.fromDto(userDto);
      user.password = bcrypt.hashSync(userDto.password, 10);

      let avatarPath = 'images/patients/patient_default.jpg';
      if (createPatientDto.avatar) {
        avatarPath = await this.imageService.saveImage(
          'patients',
          createPatientDto.avatar,
        );
      }

      const patient = this.patientsRepository.create(createPatientDto);
      patient.avatar = avatarPath;
      patient.user = Promise.resolve(user);

      const record = new Record();
      record.patient = patient;

      await queryRunner.manager.save<User>(user);
      await queryRunner.manager.save<Patient>(patient);
      await queryRunner.manager.save<Record>(record);
      await queryRunner.commitTransaction();
      return patient;
    } catch {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
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
    const patient = await this.checkIfPatientExists(id);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const appointment of await patient.appointments) {
        await queryRunner.manager.delete(Appointment, appointment.id)
      }
      await queryRunner.manager.delete(Record, { patient: patient });
      await queryRunner.manager.delete(Patient, patient.id);
      await queryRunner.manager.delete(User, (await patient.user).id);
      await queryRunner.commitTransaction();
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
}
