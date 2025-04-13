import {
  IsBase64,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePhysioDto {
  @IsNotEmpty({ message: 'Name can not be empty' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, {
    message: 'Name length must be greater or equal than 2 characters',
  })
  @MaxLength(50, {
    message: 'Name length must be lower or equal than 50 characters',
  })
  name: string;

  @IsNotEmpty({ message: 'Surname can not be empty' })
  @IsString({ message: 'Surname must be a string' })
  @MinLength(2, {
    message: 'Surname length must be greater or equals than 2 characters',
  })
  @MaxLength(50, {
    message: 'Surname length must be lower or equals than 50 characters',
  })
  surname: string;

  @IsNotEmpty({ message: 'Specialty can not be empty' })
  @IsString({ message: 'Specialty must be a string' })
  @IsEnum(['Sports', 'Neurological', 'Pediatric', 'Geriatric', 'Oncological'], {
    message:
      'Specialty must have one of these values [Sports, Neurological, Pediatric, Geriatric, Oncological]',
  })
  specialty: string;

  @IsNotEmpty({ message: 'License number can not be empty' })
  @IsString({ message: 'License number must be a string' })
  @Matches(/^[0-9A-Z]{8}$/, {
    message:
      'License number must be composed of 9 characters (numbers and capital letters)',
  })
  licenseNumber: string;

  @IsNotEmpty({ message: 'Email can not be empty' })
  @IsEmail({}, { message: 'Email do not have a correct email format' })
  @MaxLength(75, {
    message: 'Email length must be lower or equals than 75 characters',
  })
  email: string;

  @IsBase64({}, { message: 'Avatar must be encoded in base 64' })
  @IsOptional()
  avatar?: string;

  @IsNumber({}, { message: 'Latitude must be a number' })
  @IsOptional()
  lat?: number;

  @IsNumber({}, { message: 'Longitude must be a number' })
  @IsOptional()
  lng?: number;
}
