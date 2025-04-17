import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class UpdateRecordDto {
  @IsNumber({}, { message: 'ID must be a number' })
  id: number;

  @IsNotEmpty({ message: 'Medical record can not be empty' })
  @IsString({ message: 'Medical record must be a string' })
  @MaxLength(1000, {
    message: 'Medical record length must be lower or equals to 1000 characters',
  })
  medicalRecord: string;
}
