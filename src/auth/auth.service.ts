import { RegisterUserDto } from './../DTO/registerUser.dto';
import { UserEntity } from './../Entitiy/user.entity';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserLoginDto } from 'src/DTO/userLogin.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userReposity: Repository<UserEntity>,
    private jwt: JwtService,
  ) {}

  async registerUser(registerDto: RegisterUserDto) {
    const { username, password } = registerDto;
    const hashed = await bcrypt.hash(password, 12);
    const salt = bcrypt.getSalt(hashed);

    const user = new UserEntity();
    user.username = username;
    user.password = hashed;
    user.salt = salt;

    this.userReposity.create(user);
    try {
      return await this.userReposity.save(user);
    } catch (err) {
      return new InternalServerErrorException(
        'Что-то пошло не так :(, пользователь не был создан.',
      );
    }
  }

  async loginUser(userLoginDto: UserLoginDto) {
    const { username, password } = userLoginDto;

    const user = await this.userReposity.findOne({
      where: { username: username },
    });

    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные!');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (isPasswordMatch) {
      const jwtPayload = { username };
      const jwtToken = await this.jwt.signAsync(jwtPayload, {
        expiresIn: '1d',
        algorithm: 'HS512',
      });
      return { token: jwtToken };
    } else {
      throw new UnauthorizedException('Неверные учетные данные!');
    }
  }
}
