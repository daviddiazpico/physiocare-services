import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async checkIfUsernameExists(username: string) {
    const user = await this.usersRepository.findOneBy({ username });
    if (user) {
      throw new BadRequestException(
        `Username '${username}' is assigned to other user`,
      );
    }
  }

  async findOne(username: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ username: username });
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        return user;
      }
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async deleteFirebaseTokenByUsername(username: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ username });
    if (!user) {
      throw new NotFoundException(`User with username '${username}' not found`);
    }
    user.firebaseToken = '';
    await this.usersRepository.save(user);
  }
}
