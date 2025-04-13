import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePhysioDto } from './dto/create-physio.dto';
import { UpdatePhysioDto } from './dto/update-physio.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Physio } from './entities/physio.entity';
import { Repository } from 'typeorm';
import { ImageService } from 'src/shared/services/image.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PhysioService {
  constructor(
    @InjectRepository(Physio)
    private readonly physioRepository: Repository<Physio>,
    private readonly userService: UserService,
    private readonly imageService: ImageService,
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

  findAll() {
    return `This action returns all physio`;
  }

  findOne(id: number): Promise<Physio> {
    return this.#checkIfPhysioExists(id);
  }

  async create(
    createPhysioDto: CreatePhysioDto,
    userDto: UserDto,
  ): Promise<Physio> {
    await this.#checkIfLicenseNumberExists(createPhysioDto.licenseNumber);
    await this.#checkIfEmailExists(createPhysioDto.email);
    const user = await this.userService.create(userDto);

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

    return this.physioRepository.save(physio);
  }

  update(id: number, updatePhysioDto: UpdatePhysioDto) {
    return `This action updates a #${id} physio`;
  }

  remove(id: number) {
    return `This action removes a #${id} physio`;
  }
}
