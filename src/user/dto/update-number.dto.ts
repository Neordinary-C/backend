import { IsString, IsNumber } from 'class-validator';

export class UpdateNumberDto {
  @IsString()
  readonly user_id: string;
  @IsNumber()
  readonly watched_count: number;
}
