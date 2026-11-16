import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ActivityCategory } from '../generated/prisma/enums.js';

const CATEGORIES = Object.values(ActivityCategory);

export class CreateActivityDto {
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  title: string;

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  description: string;

  @IsIn(CATEGORIES)
  category: ActivityCategory;

  @IsDateString()
  startsAt: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  location: string;

  @IsInt()
  @Min(2)
  @Max(100)
  maxParticipants: number;
}
