import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class SignUpUserDto {
  @ApiProperty({ example: 'John Doe', type: String })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'John@gmail.com', type: String })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', type: String })
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
