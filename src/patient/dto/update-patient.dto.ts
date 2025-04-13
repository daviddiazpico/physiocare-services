import { IsNumber } from 'class-validator';
import { CreatePatientDto } from './create-patient.dto';

export class UpdatePatientDto extends CreatePatientDto {
    @IsNumber({}, { message: 'ID must be a number' })
    id: number;
}
