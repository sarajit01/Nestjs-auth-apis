import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { use } from 'passport';
import { HasherService } from 'src/hasher/hasher.service';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/sign-in.dto';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private hasher: HasherService,
  ) {}

  async authenticate(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('No user found in this username');
    }

    // user exists, check if password matches
    const isPassCorrect = await this.hasher.comparePassword(
      user.password,
      password,
    );
    if (!isPassCorrect) {
      throw new UnauthorizedException('The password you entered is wrong');
    }

    // obtain tokens
    const { access_token, refresh_token } = await this.generateTokens(
      user.id,
      user.email,
    );
    // save the refresh token in db
    this.userService.saveRefreshToken(user.id, refresh_token);

    return { access_token, refresh_token };
  }

  async generateTokens(userId: number, email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: 'at-secret', expiresIn: '15m' },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: 'rt-secret', expiresIn: '1d' },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async refreshToken(user: any, attemptedToken: string) {
    console.log('Hasing attemptedToken', attemptedToken);
    const userValidToken = await this.userService.getMatchedToken(
      user.id,
      attemptedToken,
    );
    if (!userValidToken) {
      throw new UnauthorizedException('The refresh token is invalid');
    }

    const { access_token, refresh_token } = await this.generateTokens(
      user.id,
      user.email,
    );

    const updateExistingToken = await this.userService.updateRefreshToken(
      user.id,
      refresh_token,
      userValidToken.id,
    );

    return { access_token, refresh_token };
  }

  async getProfile(id: number) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User not found with the ID ${id}`);
    }
    // remove password from user object
    const { password, ...userInfoExcludeSensitive } = user;
    return userInfoExcludeSensitive;
  }
}
