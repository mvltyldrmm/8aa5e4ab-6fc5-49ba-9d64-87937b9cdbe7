import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/roles/roles.detector';
import { CreateStoreBookDto } from './dto/create-store-book.dto';
import { UpdateStoreStockDto } from './dto/update-store-stock.dto';

@Controller('stores')
@ApiTags('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @ApiOperation({
    summary: 'Yeni bir mağaza oluşturma',
    description:
      'Role = admin (Her mağazada bir yöneticiye ihtiyaç olduğu için yönetici bilgileri de girilmelidir ve email-şifre unutulmamalıdır.)',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin')
  @Post()
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  @ApiOperation({
    summary: 'Bir mağazaya kitap ekleme',
    description:
      'Role = admin | store_management (mağaza yöneticisin bu servisi çalıştırmya yetkisi vardır ama gönderilen store_id de gerçekten yönetici olup olmaması kontrol edilir.)',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'store_management')
  @Post('book')
  storeAddedBook(
    @Request() request: any,
    @Body() createStoreBookDto: CreateStoreBookDto,
  ) {
    const user_id = request.user.sub.user_id;
    const is_admin = request.user.sub.role == 'admin' ? true : false;
    return this.storesService.storeAddedBook(
      user_id,
      createStoreBookDto,
      is_admin,
    );
  }

  @ApiOperation({
    summary: 'Tüm kitapçıları listeleme',
    description: `Role = admin | 'store_management | user`,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'store_management', 'user')
  @Get()
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async getStores(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<any> {
    return this.storesService.getStores(+limit || 10, +offset || 0);
  }

  @ApiOperation({
    summary: 'Bir mağazadaki kitapları listeleme',
    description: `Role = admin | store_management | user`,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'store_management', 'user')
  @Get('/:store_id/books')
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  async getStoreBooks(
    @Param('store_id') store_id: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<any> {
    return this.storesService.getStoreBooks(
      +limit || 10,
      +offset || 0,
      +store_id,
    );
  }

  @ApiOperation({
    summary: 'Mağazadaki bir kitabın stok sayısını güncelleme',
    description:
      'Role = admin | store_management (mağaza yöneticisin bu servisi çalıştırmya yetkisi vardır ama gönderilen store_id de gerçekten yönetici olup olmaması kontrol edilir.)',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'store_management')
  @Patch('/:store_id/book-stock')
  async updateStoreStock(
    @Param('store_id') store_id: number,
    @Body() createStoreBookDto: UpdateStoreStockDto,
    @Request() request: any,
  ): Promise<any> {
    const is_admin = request.user.sub.role == 'admin' ? true : false;
    console.log(request.user);
    const user_id = request.user.sub.user_id;
    return this.storesService.updateStoreStock(
      +store_id,
      createStoreBookDto,
      is_admin,
      +user_id,
    );
  }
}
