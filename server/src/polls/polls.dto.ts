import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreatePollDto {
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  question: string;

  @IsArray()
  @ArrayMinSize(2, { message: 'A poll needs at least 2 options' })
  @ArrayMaxSize(6, { message: 'A poll can have at most 6 options' })
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @MaxLength(80, { each: true })
  options: string[];

  @IsOptional()
  @IsDateString()
  endsAt?: string;
}

export class VoteDto {
  @IsUUID()
  optionId: string;
}
