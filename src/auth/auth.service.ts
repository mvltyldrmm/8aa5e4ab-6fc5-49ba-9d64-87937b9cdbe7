import { Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { comparePasswords, encodePassword } from 'src/utils/bcrypt';
import { CustomError } from 'src/shared/api-response.model';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}
  async login(LoginAuthDto: LoginAuthDto) {
    const user = await this.prisma.users.findUnique({
      where: {
        email: LoginAuthDto.email,
      },
    });

    if (user) {
      const matched = comparePasswords(LoginAuthDto.password, user.password);
      if (matched) {
        const payload = {
          sub: {
            user_id: user.id,
            email: user.email,
            role: user.type,
          },
        };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '48h' });
        const expiresIn = Math.floor(Date.now() / 1000) + 48 * 60 * 60;

        return {
          access_token: accessToken,
          user: payload.sub,
          expires_in: expiresIn,
        };
      } else {
        return false;
      }
    } else {
      return user;
    }
  }

  async register(CreateUserDto: CreateUserDto) {
    const existingUserByEmail = await this.prisma.users.findUnique({
      where: { email: CreateUserDto.email },
    });

    if (existingUserByEmail) {
      throw new CustomError(
        'There is another account using this email address',
        409,
      );
    }

    const decodePassword = CreateUserDto.password;
    CreateUserDto.password = encodePassword(CreateUserDto.password);
    const createUser = await this.prisma.users.create({ data: CreateUserDto });
    if (createUser) {
      const matched = comparePasswords(decodePassword, createUser.password);
      if (matched) {
        const payload = {
          username: createUser.email,
          sub: {
            user_id: createUser.id,
            email: createUser.email,
            role: createUser.type,
          },
        };
        return {
          access_token: this.jwtService.sign(payload),
        };
      } else {
        return false;
      }
    } else {
      return CreateUserDto;
    }
  }
}
