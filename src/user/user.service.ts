import { BadRequestException, Injectable } from '@nestjs/common';
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

  async findOne(username: string, password: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({
      username: username,
      password: await bcrypt.hash(password, 10),
    });
  }

  async create(userDto: UserDto): Promise<User> {
    await this.#checkIfUsernameExists(userDto.username);

    return this.usersRepository.save(this.usersRepository.create(userDto));
  }
}
