import { IsEmail, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(60)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  faculty?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(6)
  year?: number;
}

export class LoginDto {
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;

  @IsString()
  password: string;
}
