import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLogin } from './interfaces/user-login.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() userLogin: UserLogin,
  ): Promise<{ token: string; rol: string }> {
    if (!userLogin || !userLogin.username || !userLogin.password) {
      throw new BadRequestException('Username and password can not be empty');
    }

    return await this.authService.login(userLogin.username, userLogin.password);
  }
}
