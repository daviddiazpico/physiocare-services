import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Token } from 'src/shared/decorators/token.decorator';
import { Username } from 'src/shared/decorators/username.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AuthService } from './auth.service';
import { UserLogin } from './interfaces/user-login.interface';

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

    return await this.authService.login(userLogin);
  }

  @Delete('logout/firebase')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  async deleteFirebaseToken(@Username() username: string): Promise<void> {
    await this.authService.deleteFirebaseToken(username);
  }
}
