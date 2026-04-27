import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class RTStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'rt-secret',
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req.get('authorization')?.replace('Bearer', '').trim();

    console.log('Triggering the validate function of RT strategy o passport');
    console.log(payload);
    payload.id = payload.sub;
    return { ...payload, refreshToken };
  }
}
