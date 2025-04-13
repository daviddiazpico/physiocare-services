import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserDto {
  @IsNotEmpty({ message: 'Username can not be empty' })
  @IsString({ message: 'Username must be a string' })
  @MinLength(4, {
    message: 'Surname length must be greater or equals then 4 characters',
  })
  readonly username: string;

  @IsNotEmpty({ message: 'Password can not be empty' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(7, {
    message: 'Password length must be greater or equals then 7 characters',
  })
  readonly password: string;

  @IsNotEmpty({ message: 'Rol can not be empty' })
  @IsString({ message: 'Rol must be a string' })
  @IsEnum(['admin', 'physio', 'patient'], {
    message: 'Rol must have one of these values [admin, physio, patient]',
  })
  readonly rol: string;
  
  readonly firebaseToken: string;
}
