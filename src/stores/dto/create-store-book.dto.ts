import {} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateStoreBookDto {
  @ApiProperty()
  book_id: number;
  @ApiProperty()
  store_id: number;
  @ApiProperty()
  stock: number;
}
