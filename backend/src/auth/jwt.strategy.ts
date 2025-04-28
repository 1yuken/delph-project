import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    // Map 'sub' from JWT to userId for consistency
    const userId = await this.usersService.findOneByUsernameWithPassword(
      payload.username,
    );

    if (userId === null) {
      throw new ForbiddenException(
        'Current user not found. The account was probably deactivated. Please contact administrator.',
      );
    } else {
      return {
        userId: userId.id,
        username: payload.username,
      };
    }
  }
}
