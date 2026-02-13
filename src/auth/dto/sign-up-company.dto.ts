import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class SignUpCompanyDto {
  @ApiProperty({ example: 'Tech Corp', type: String })
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty({ example: 'Company description', type: String })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: 'admin@techcorp.com', type: String })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+995555123456', type: String })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({ example: 'https://techcorp.com', type: String })
  @IsOptional()
  @IsUrl()
  website: string;

  @ApiProperty({ example: 'John Doe', type: String })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'password123', type: String })
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
