import { IsBase64, IsDateString, IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreatePatientDto { 
    @IsNotEmpty({ message: 'Name can not be empty' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(2, { message: 'Name length must be greater or equal than 2 characters' })
    @MaxLength(50, { message: 'Name length must be lower or equal than 50 characters' })
    name: string;

    @IsNotEmpty({ message: 'Surname can not be empty' })
    @IsString({ message: 'Surname must be a string' })
    @MinLength(2, { message: 'Surname length must be greater or equals than 2 characters' })
    @MaxLength(50, { message: 'Surname length must be lower or equals than 50 characters' })
    surname: string;

    @IsNotEmpty({ message: 'Date can not be empty' })
    @IsDateString({}, { message: 'Date do not have a date format' })
    birthdate: Date;

    @IsString({ message: 'Address must be a string' })
    @MaxLength(100, { message: 'Address length must be lower or equals than 100 characters' })
    address: string;

    @IsNotEmpty({ message: 'Insurance number can not be empty' })
    @IsString({ message: 'Insurance number must be a string' })
    @Matches(/^[0-9A-Z]{9}$/, { message: 'Insurance number must be composed of 9 characters (numbers and capital letters)' })
    insuranceNumber: string;

    @IsNotEmpty({ message: 'Email can not be empty' })
    @IsEmail({}, { message: 'Email do not have a correct email format' })
    @MaxLength(75, { message: 'Email length must be lower or equals than 75 characters' })
    email: string;

    @IsBase64({}, { message: 'Avatar must be encoded in base 64' })
    avatar: string;
}
