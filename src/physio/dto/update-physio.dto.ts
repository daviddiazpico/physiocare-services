import { IsNumber } from 'class-validator';
import { CreatePhysioDto } from './create-physio.dto';

export class UpdatePhysioDto extends CreatePhysioDto {
    @IsNumber({}, { message: 'ID must be a number' })
    id: number
}
