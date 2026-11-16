import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  description: string;

  @IsDateString()
  startsAt: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  location: string;

  @IsOptional()
  @IsUrl({ require_protocol: true }, { message: 'Image must be a full link (https://...)' })
  imageUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10000)
  capacity?: number;

  @IsOptional()
  @IsUrl({ require_protocol: true }, { message: 'Registration link must be a full link (https://...)' })
  registrationUrl?: string;

  @IsOptional()
  @IsUUID()
  clubId?: string;
}
