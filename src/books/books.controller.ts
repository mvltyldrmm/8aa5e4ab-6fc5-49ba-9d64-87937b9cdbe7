import { Roles } from './../auth/roles/roles.detector';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from './../auth/role/role.guard';
import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books')
@ApiTags('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @ApiOperation({
    summary: 'Yeni kitap oluşturma servisi.',
    description: `Role = admin`,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin')
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @ApiOperation({
    summary: 'Kitap arama ve kitabın hangi mağazalarda olduğunu görme servisi.',
    description: `Role = admin | store_management | user`,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles('admin', 'store_management', 'user')
  @Get('/search')
  @ApiQuery({ name: 'search_text', required: false, type: String })
  async getStoreBooks(
    @Query('search_text') search_text?: string,
  ): Promise<any> {
    return this.booksService.searchBooks(search_text);
  }
}
