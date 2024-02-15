import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}
  create(createBookDto: CreateBookDto) {
    return this.prisma.books.create({
      data: createBookDto,
    });
  }

  async searchBooks(search_text: string) {
    const data = await this.prisma.books.findMany({
      where: {
        OR: [
          {
            title: {
              contains: search_text,
              mode: 'insensitive',
            },
          },
          {},
        ],
      },
      include: {
        store_books: {
          include: {
            store: true,
          },
        },
      },
    });
    return data;
  }
}
