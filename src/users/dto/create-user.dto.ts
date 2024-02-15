import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  phone_number?: string;

  @IsString()
  @ApiProperty({ required: true })
  @IsOptional()
  password: string;

  @IsEmail()
  @ApiProperty()
  @IsOptional()
  email: string;

  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  firstname?: string;

  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  lastname?: string;

  @IsEnum(UserType)
  @ApiProperty({ default: 'user' })
  @IsOptional()
  type?: UserType;

  constructor(partial: Partial<CreateUserDto> = {}) {
    Object.assign(this, partial);
  }
}
