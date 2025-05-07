import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/appointment/entities/appointment.entity';
import { Patient } from 'src/patient/entities/patient.entity';
import { Repository } from 'typeorm';
import { UpdateRecordDto } from './dto/update-record.dto';
import { Record } from './entities/record.entity';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  private async checkIfRecordExists(id: number): Promise<Record> {
    const record = await this.recordRepository.findOneBy({ id });
    if (!record) {
      throw new NotFoundException('Record not found');
    }

    return record;
  }

  async findAll(): Promise<Record[]> {
    const records = await this.recordRepository.find();
    if (!records) {
      throw new NotFoundException("There aren't records in the system");
    }

    return records;
  }

  async findByPatientSurname(surname: string): Promise<Record[]> {
    const records = await this.recordRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.patient', 'patient')
      .where((qb) => {
        const subquery = qb
          .subQuery()
          .select('id')
          .from(Patient, 'patient')
          .where('surname ILIKE :surname', { surname: `%${surname}%` })
          .getQuery();
        return 'r.patientId IN ' + subquery;
      })
      .getMany();

    if (records.length === 0) {
      throw new NotFoundException('No records found');
    }
    return records;
  }

  findOne(id: number): Promise<Record> {
    return this.checkIfRecordExists(id);
  }

  async findOneByPatientId(patientId: number): Promise<Record> {
    const record = await this.recordRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.patient', 'patient')
      .where('r.patientId = :id', { id: patientId })
      .getOne();

    if (!record) {
      throw new NotFoundException('Record not found');
    }
    return record;
  }

  async findRecordAppointments(id: number): Promise<Appointment[]> {
    const appointments = await (await this.findOne(id)).appointments;
    if (appointments.length === 0) {
      throw new NotFoundException(
        'This record does not have any appointment associated',
      );
    }

    return appointments;
  }

  async update(id: number, updateRecordDto: UpdateRecordDto): Promise<Record> {
    const record = await this.checkIfRecordExists(id);
    record.medicalRecord = updateRecordDto.medicalRecord;
    return this.recordRepository.save(record);
  }

  async remove(id: number): Promise<void> {
    await this.checkIfRecordExists(id);
    await this.recordRepository.delete(id);
  }
}
