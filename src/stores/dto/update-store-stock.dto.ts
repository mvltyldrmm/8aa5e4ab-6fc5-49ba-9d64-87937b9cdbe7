import {} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateStoreStockDto {
  @ApiProperty()
  stock: number;

  @ApiProperty()
  book_id: number;
}
