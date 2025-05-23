import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLogin } from './interfaces/user-login.interface';
import { Token } from 'src/shared/decorators/token.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('validate')
  @HttpCode(204)
  validate(@Token() token: string) {
    if (!this.authService.validate(token)) {
      throw new UnauthorizedException();
    }
  }

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
