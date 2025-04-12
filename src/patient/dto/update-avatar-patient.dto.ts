import { IsBase64, IsNotEmpty } from 'class-validator';

export class UpdateAvatarPatientDto {
  @IsNotEmpty({ message: 'Avatar can not be empty' })
  @IsBase64({}, { message: 'Avatar must be encoded in base64' })
  avatar: string;
}
