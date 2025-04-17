import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  findOne(id: number): Promise<Record> {
    return this.checkIfRecordExists(id);
  }

  async create(patient: Patient): Promise<void> {
    const record = new Record();
    record.patient = patient;
    await this.recordRepository.save(record);
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
