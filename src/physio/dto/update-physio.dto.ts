import { PartialType } from '@nestjs/mapped-types';
import { CreatePhysioDto } from './create-physio.dto';

export class UpdatePhysioDto extends PartialType(CreatePhysioDto) {}
