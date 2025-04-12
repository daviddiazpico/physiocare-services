import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOne(username: string, password: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({
      username: username,
      password: await bcrypt.hash(password, 10),
    });
  }
}
