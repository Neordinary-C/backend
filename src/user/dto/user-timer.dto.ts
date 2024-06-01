import { IsString, IsDate } from 'class-validator';

export class StartTimerDto {
  @IsString()
  readonly user_id: string;
  @IsDate()
  readonly start_time: Date;
}
