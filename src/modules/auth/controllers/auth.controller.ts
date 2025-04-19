import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService, SignInResponse } from '../services/auth.service';
import { SignInDto } from '../dtos/signin.dto';
import { Public } from 'src/common/decorators/public.decorator';
import status from 'http-status';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-in')
  @HttpCode(status.OK)
  async create(@Body() signInDto: SignInDto): Promise<SignInResponse> {
    return await this.authService.signIn(signInDto);
  }
}
