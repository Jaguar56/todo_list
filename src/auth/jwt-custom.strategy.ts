import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from 'src/Entitiy/user.entity';
import { Repository } from 'typeorm';

export class JwtCustomStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity) private userReposity: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'eslkfJWLEUVBF:awEO12qwea8987',
    });
  }

  async validate(playload: { username: string }) {
    const { username } = playload;
    const user = await this.userReposity.findOne({
      where: { username: username },
    });

    if (!user) {
      throw new UnauthorizedException('');
    }
    return user;
  }
}
