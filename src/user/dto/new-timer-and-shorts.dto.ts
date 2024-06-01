import { IsArray, IsNumber, IsString } from 'class-validator';

export class NewTimerAndShortsDto {
  @IsString()
  readonly user_id: string;
  @IsNumber()
  readonly count: number;
  @IsNumber()
  readonly time_h: number;
  @IsNumber()
  readonly time_m: number;
  @IsArray()
  readonly categories: number[];
}
