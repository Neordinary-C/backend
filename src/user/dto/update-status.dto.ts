import { IsString, IsIn } from 'class-validator';

export class UpdateStatusDto {
  @IsString()
  readonly user_id: string;

  @IsString()
  @IsIn(['ongoing', 'success', 'failed'])
  readonly status: string;
}
