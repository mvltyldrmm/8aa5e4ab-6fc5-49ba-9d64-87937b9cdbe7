import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Giriş Yap',
    description: 'Rol = Tüm Roller.',
  })
  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    const login = await this.authService.login(loginAuthDto);
    if (!login) {
      throw new NotFoundException(
        `User with email : ${loginAuthDto.email} not found`,
      );
    } else {
      return login;
    }
  }

  @ApiOperation({
    summary: 'Kayıt Ol',
    description:
      'Örnek olması için eklenmiştir. type = admin|store_management|user olabilir. Admin oluşturulup diğer api ler test edilebilir.',
  })
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}
