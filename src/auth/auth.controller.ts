import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { use } from 'passport';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() signInDto: SignInDto) {
    return this.authService.authenticate(
      signInDto.username,
      signInDto.password,
    );
    //return this.authService.getTokens(1, 'sarajit@gmail.com');
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Req() req: any) {
    const user = req.user;
    console.log('User info from passport:');
    console.log(user);
    console.log('Hashable token', user.refreshToken);
    return this.authService.refreshToken(user, user.refreshToken);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  userProfile(@Req() req: any) {
    const { user } = req;
    return this.authService.getProfile(user.sub);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('delete-refresh-tokens')
  deleteRefreshTokens(@Req() req: any) {
    const { user } = req;
    return this.authService.deleteTokens(user);
  }
}
