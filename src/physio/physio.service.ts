import { Injectable } from '@nestjs/common';
import { CreatePhysioDto } from './dto/create-physio.dto';
import { UpdatePhysioDto } from './dto/update-physio.dto';

@Injectable()
export class PhysioService {
  create(createPhysioDto: CreatePhysioDto) {
    return 'This action adds a new physio';
  }

  findAll() {
    return `This action returns all physio`;
  }

  findOne(id: number) {
    return `This action returns a #${id} physio`;
  }

  update(id: number, updatePhysioDto: UpdatePhysioDto) {
    return `This action updates a #${id} physio`;
  }

  remove(id: number) {
    return `This action removes a #${id} physio`;
  }
}
