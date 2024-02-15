import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  NotFoundException,
  Body,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/roles/roles.detector';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Token sahibinin bilgilerini döndürür',
    description: 'Role = admin | store_management | user',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'user', 'store_management')
  @Get('me')
  async getMe(@Request() request: any): Promise<any> {
    const userId = request.user.sub.user_id;
    const user = await this.usersService.getMe(+userId);
    if (!user) {
      throw new NotFoundException(`User with id : ${userId} not found`);
    }
    return user;
  }

  @ApiOperation({
    summary: 'Sistemdeki user ları listeleme',
    description: 'Get Users List',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('Role = admin | store_management | user')
  @UseGuards(AuthGuard)
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'limit',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'offset',
  })
  @Get()
  async getUsers(
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ): Promise<any> {
    return this.usersService.getUsers(+limit, +offset);
  }

  @ApiOperation({
    summary: 'Kullanıcı oluşturma.',
    description:
      'Role = admin (admin role u ile herhangi bir tipte (admin,user,store_management) kullanıcı oluşturulabilir.)',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin')
  @UseGuards(AuthGuard)
  @Post()
  async userCreate(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.usersService.createUser(createUserDto);
  }
}
