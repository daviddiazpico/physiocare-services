import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { Record } from './entities/record.entity';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  async #checkIfRecordExists(id: number): Promise<Record> {
    const record = await this.recordRepository.findOneBy({ id });
    if (!record) {
      throw new NotFoundException('Record not found');
    }

    return record;
  }

  create(createRecordDto: CreateRecordDto) {
    return 'This action adds a new record';
  }

  findAll() {
    return `This action returns all record`;
  }

  findOne(id: number): Promise<Record> {
    return this.#checkIfRecordExists(id);
  }

  update(id: number, updateRecordDto: UpdateRecordDto) {
    return `This action updates a #${id} record`;
  }

  remove(id: number) {
    return `This action removes a #${id} record`;
  }
}
