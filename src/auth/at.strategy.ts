import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class ATStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'at-secret',
    });
  }

  validate(payload: any) {
    console.log('Triggering the validate function of AT strategy o passport');
    console.log(payload);
    const data = { ...payload };
    return data;
  }
}
