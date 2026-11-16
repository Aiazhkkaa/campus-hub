import { IsInt, IsOptional, IsString, IsUrl, Max, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(60)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  faculty?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(6)
  year?: number;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  bio?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true }, { message: 'Photo must be a full link (https://...)' })
  avatarUrl?: string;
}
