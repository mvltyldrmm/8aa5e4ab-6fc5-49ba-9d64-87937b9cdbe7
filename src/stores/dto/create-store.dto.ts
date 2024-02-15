import { IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateStoreDto {
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @MinLength(6)
  password: string;
  @ApiProperty()
  store_name: string;
  @ApiProperty()
  user_firstname: string;
  @ApiProperty()
  user_lastname: string;
  @ApiProperty()
  store_address: string;
  @ApiProperty()
  store_phone_number: string;
  @ApiProperty()
  user_phone_number: string;

  management_id: number;
}
