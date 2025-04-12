import { Body, Controller, Post } from '@nestjs/common';
import { UserDto } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() userDto: UserDto): Promise<string> {
    const token = await this.authService.login(
      userDto.username,
      userDto.password,
    );

    return token;
  }
}
