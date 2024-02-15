import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { encodePassword } from 'src/utils/bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(user_id: number) {
    const user = await this.prisma.users.findUnique({ where: { id: user_id } });
    return user;
  }

  async getUsers(limit: number = 10, offset: number = 0) {
    const users = await this.prisma.users.findMany({
      where: {
        type: 'user',
      },
      take: limit,
      skip: offset,
    });

    return users;
  }

  async createUser(createUserDto: CreateUserDto) {
    if (createUserDto.password) {
      createUserDto.password = encodePassword(createUserDto.password);
    }
    const user = await this.prisma.users.create({
      data: createUserDto,
    });

    return user;
  }
}
