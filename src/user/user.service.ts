import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async #checkIfUsernameExists(username: string) {
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

  async create(userDto: UserDto): Promise<User> {
    await this.#checkIfUsernameExists(userDto.username);

    const user = this.usersRepository.create(userDto);
    user.password = await bcrypt.hash(user.password, 10);
    return this.usersRepository.save(user);
  }
}
