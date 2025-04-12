import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>,
  ) {}

  create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const newPatient = new Patient();
    newPatient.name = createPatientDto.name;
    newPatient.surname = createPatientDto.surname;
    newPatient.birthdate = createPatientDto.birthdate;
    newPatient.address = createPatientDto.address;
    newPatient.insuranceNumber = createPatientDto.insuranceNumber;
    newPatient.email = createPatientDto.email;
    newPatient.avatar = createPatientDto.avatar;

    return this.patientsRepository.save(newPatient);
  }

  findAll(): Promise<Patient[]> {
    return this.patientsRepository.find();
  }

  async findOne(id: number): Promise<Patient | null> {
    const patient = await this.patientsRepository.findOneBy({ id });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  update(id: number, updatePatientDto: UpdatePatientDto) {
    const updatePatient = new Patient();
    updatePatient.name = updatePatientDto.name;
    updatePatient.surname = updatePatientDto.surname;
    updatePatient.birthdate = updatePatientDto.birthdate;
    updatePatient.address = updatePatientDto.address;
    updatePatient.insuranceNumber = updatePatientDto.insuranceNumber;
    updatePatient.email = updatePatientDto.email;
    updatePatient.avatar = updatePatientDto.avatar;

    return `This action updates a #${id} patient`;
  }

  async remove(id: number): Promise<void> {
    await this.patientsRepository.delete(id);
  }
}
