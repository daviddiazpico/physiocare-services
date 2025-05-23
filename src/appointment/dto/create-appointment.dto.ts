import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty({ message: 'Date can not be empty' })
  @IsDateString({}, { message: 'Date do not have a date format' })
  date: Date;

  @IsNotEmpty({ message: 'Diagnosis can not be empty' })
  @IsString({ message: 'Diagnosis must be a string' })
  @MinLength(10, {
    message: 'Diagnosis length must be greater or equals than 10 characters',
  })
  @MaxLength(500, {
    message: 'Diagnosis length must be lower or equals than 500 characters',
  })
  diagnosis: string;

  @IsNotEmpty({ message: 'Treatment can not be empty' })
  @IsString({ message: 'Treatment must be a string' })
  @MaxLength(150, {
    message: 'Treatment length must be lower or equals then 150 characters',
  })
  treatment: string;

  @IsString({ message: 'Observations must be a string' })
  @MaxLength(500, {
    message: 'Diagnosis length must be lower or equals than 500 characters',
  })
  @IsOptional()
  observations?: string;

  @IsNotEmpty({ message: 'Patient id can not be empty' })
  @IsNumber({}, { message: 'Patient id must be a number' })
  patientId: number;

  @IsNotEmpty({ message: 'Physio id can not be empty' })
  @IsNumber({}, { message: 'Physio id must be a number' })
  physioId: number;
}
