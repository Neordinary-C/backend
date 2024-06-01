<<<<<<< HEAD
import { IsString, IsIn } from 'class-validator';

export class UpdateStatusDto {
  @IsString()
  readonly user_id: string;

  @IsString()
  @IsIn(['ongoing', 'success', 'failed'])
  readonly status: string;
=======
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

import { IsString, IsIn, IsNumber } from 'class-validator';


export class UpdateStatusDto {
    @IsString()
    readonly user_id: string;

    @IsString()
    @IsIn(['ongoing', 'success', 'failed'])
    readonly status: string;
>>>>>>> 91c0a2c14231f152c58561acdf07c4a4908b72d7
}
