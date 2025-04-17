import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ImageService } from 'src/shared/services/image.service';
import { UserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { DataSource, Repository } from 'typeorm';
import { CreatePhysioDto } from './dto/create-physio.dto';
import { UpdateAvatarPhysioDto } from './dto/update-avatar-physio.dto';
import { UpdatePhysioDto } from './dto/update-physio.dto';
import { Physio } from './entities/physio.entity';

@Injectable()
export class PhysioService {
  constructor(
    @InjectRepository(Physio)
    private readonly physioRepository: Repository<Physio>,
    private readonly userService: UserService,
    private readonly imageService: ImageService,
    private readonly dataSource: DataSource,
  ) {}

  async #checkIfPhysioExists(id: number): Promise<Physio> {
    const physio = await this.physioRepository.findOneBy({ id });
    if (!physio) {
      throw new NotFoundException('Physio not found');
    }
    return physio;
  }

  async #checkIfLicenseNumberExists(
    licenseNumber: string,
    physioId = 0,
  ): Promise<void> {
    const physio = await this.physioRepository.findOneBy({ licenseNumber });
    if (physio && physio.id !== physioId) {
      throw new BadRequestException(
        `License number ${licenseNumber} is assigned to other physio`,
      );
    }
  }

  async #checkIfEmailExists(email: string, physioId = 0): Promise<void> {
    const physio = await this.physioRepository.findOneBy({ email });
    if (physio && physio.id !== physioId) {
      throw new BadRequestException(
        `The email '${email}' is assigned to other physio`,
      );
    }
  }

  async findAll(): Promise<Physio[]> {
    const physios = await this.physioRepository.find();
    if (!physios) {
      throw new NotFoundException(
        "There aren't physios registered in the system",
      );
    }

    return physios;
  }

  async findBySpecialty(specialty: string): Promise<Physio[]> {
    const physios = await this.physioRepository
      .createQueryBuilder()
      .where('specialty = :specialty', { specialty: specialty })
      .getMany();

    if (physios.length === 0) {
      throw new NotFoundException('No physios found');
    }

    return physios;
  }

  findOne(id: number): Promise<Physio> {
    return this.#checkIfPhysioExists(id);
  }

  async create(
    createPhysioDto: CreatePhysioDto,
    userDto: UserDto,
  ): Promise<Physio> {
    await this.userService.checkIfUsernameExists(userDto.username);
    await this.#checkIfLicenseNumberExists(createPhysioDto.licenseNumber);
    await this.#checkIfEmailExists(createPhysioDto.email);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = User.fromDto(userDto);
      user.password = bcrypt.hashSync(userDto.password, 10);

      let avatarPath = 'images/physios/patient_default.jpg';
      if (createPhysioDto.avatar) {
        avatarPath = await this.imageService.saveImage(
          'physios',
          createPhysioDto.avatar,
        );
      }

      const physio = this.physioRepository.create(createPhysioDto);
      physio.avatar = avatarPath;
      physio.user = user;

      await queryRunner.manager.save<User>(user);
      await queryRunner.manager.save<Physio>(physio);
      await queryRunner.commitTransaction();
      return physio;
    } catch {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, updatePhysioDto: UpdatePhysioDto): Promise<Physio> {
    const physio = await this.#checkIfPhysioExists(id);
    await this.#checkIfLicenseNumberExists(updatePhysioDto.licenseNumber, id);
    await this.#checkIfEmailExists(updatePhysioDto.email, id);

    for (const property in updatePhysioDto) {
      if (property !== 'avatar') {
        physio[property] = updatePhysioDto[property];
      }
    }

    return this.physioRepository.save(physio);
  }

  async updateAvatar(
    id: number,
    updateAvatarPhysioDto: UpdateAvatarPhysioDto,
  ): Promise<string> {
    const patient = await this.#checkIfPhysioExists(id);

    if (updateAvatarPhysioDto.avatar) {
      const avatarPath = await this.imageService.saveImage(
        'physios',
        updateAvatarPhysioDto.avatar,
      );
      patient.avatar = avatarPath;
    }

    return (await this.physioRepository.save(patient)).avatar;
  }

  async remove(id: number): Promise<void> {
    await this.#checkIfPhysioExists(id);
    await this.physioRepository.delete(id);
  }
}
