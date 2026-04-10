import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ATStrategy } from './at.strategy';
import { RTStrategy } from './rt.strategy';
import { UserModule } from 'src/user/user.module';
import { HasherModule } from 'src/hasher/hasher.module';

@Module({
  imports: [JwtModule.register({}), UserModule, HasherModule],
  providers: [AuthService, ATStrategy, RTStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
