import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { encodePassword } from 'src/utils/bcrypt';
import { CreateStoreBookDto } from './dto/create-store-book.dto';
import { CustomError } from 'src/shared/api-response.model';
import { UpdateStoreStockDto } from './dto/update-store-stock.dto';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}
  async create(createStoreDto: CreateStoreDto) {
    createStoreDto.password = encodePassword(createStoreDto.password);

    const user = await this.prisma.users.create({
      data: {
        email: createStoreDto.email,
        password: createStoreDto.password,
        firstname: createStoreDto.user_firstname,
        lastname: createStoreDto.user_lastname,
        phone_number: createStoreDto.user_phone_number,
        type: 'store_management',
      },
    });

    const store = await this.prisma.stores.create({
      data: {
        management_id: user.id,
        name: createStoreDto.store_name,
        address: createStoreDto.store_address,
        phone_number: createStoreDto.store_phone_number,
      },
    });

    return {
      user: user,
      store: store,
    };
  }

  async storeAddedBook(
    user_id: number,
    createStoreBookDto: CreateStoreBookDto,
    is_admin: boolean,
  ) {
    let store: any;
    if (!is_admin) {
      store = await this.prisma.stores.findFirst({
        where: {
          management_id: user_id,
        },
      });

      if (!store) {
        throw new CustomError('Store not found', 404);
      }
    }

    const book = await this.prisma.books.findFirst({
      where: {
        id: createStoreBookDto.book_id,
      },
    });

    if (!book) {
      throw new CustomError('Book not found', 404);
    }

    const storeBook = await this.prisma.store_books.create({
      data: {
        book: {
          connect: {
            id: createStoreBookDto.book_id,
          },
        },
        store: {
          connect: {
            id: store.id,
          },
        },
        stock: createStoreBookDto.stock,
      },
    });

    return storeBook;
  }

  async getStores(limit: number, offset: number) {
    const data = await this.prisma.stores.findMany({
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
      skip: offset,
    });
    return data;
  }

  async getStoreBooks(limit: number, offset: number, store_id: number) {
    const data = await this.prisma.books.findMany({
      where: {
        store_books: {
          some: {
            store_id: store_id,
          },
        },
      },
      include: {
        store_books: true,
      },
      take: limit,
      skip: offset,
    });
    return data;
  }

  async updateStoreStock(
    store_id: number,
    updateStoreStockDto: UpdateStoreStockDto,
    is_admin: boolean,
    user_id: number,
  ) {
    if (!is_admin) {
      const store = await this.prisma.stores.findFirst({
        where: {
          management_id: user_id,
        },
      });
      if (!store) {
        throw new CustomError('Forbidden', 403);
      }
    }
    const books = await this.prisma.books.findUnique({
      where: { id: updateStoreStockDto.book_id },
    });
    if (!books) {
      throw new CustomError('Book not found', 404);
    }

    const data = await this.prisma.store_books.updateMany({
      where: {
        store_id: store_id,
        book_id: updateStoreStockDto.book_id,
      },
      data: {
        stock: updateStoreStockDto.stock,
      },
    });

    return data;
  }
}
