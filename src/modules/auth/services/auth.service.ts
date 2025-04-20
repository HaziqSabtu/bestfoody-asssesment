import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { SignInDto } from '../dtos/signin.dto';
import { JwtService } from '@nestjs/jwt';

export interface SignInResponse {
  token: string;
  expiresAt: Date;
  user: Pick<User, 'id' | 'email'>;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<SignInResponse> {
    const user = await this.userService.findByEmail(signInDto.email);

    if (!user) {
      throw new UnauthorizedException('Wrong email or password');
    }

    if (user.password !== signInDto.password) {
      throw new UnauthorizedException('Wrong email or password');
    }

    const tokenDurationMilli = 60 * 60 * 1000; // 1 hour
    const expiresAt = new Date().getTime() + tokenDurationMilli;

    const payload = {
      sub: user.id,
      email: user.email,
      userId: user.id,
      iss: 'bestfoody-asssesment',
      aud: 'bestfoody-asssesment',
    };

    const options = {
      expiresIn: '1h',
    };

    const token = await this.jwtService.signAsync(payload, options);

    return {
      token: token,
      expiresAt: new Date(expiresAt),
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
