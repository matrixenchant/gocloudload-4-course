import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(255)
  password: string;

  @IsString()
  @MaxLength(100)
  first_name: string;

  @IsString()
  @MaxLength(100)
  last_name: string;
}
