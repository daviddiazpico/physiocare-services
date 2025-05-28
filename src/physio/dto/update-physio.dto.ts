import { IsNumber, IsOptional } from 'class-validator';
import { CreatePhysioDto } from './create-physio.dto';

export class UpdatePhysioDto extends CreatePhysioDto {
  @IsNumber({}, { message: 'ID must be a number' })
  @IsOptional()
  id: number;
}
