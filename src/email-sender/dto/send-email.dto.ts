import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailDTO {
  @IsNotEmpty()
  @IsEmail()
  to: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}
