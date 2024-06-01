import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

import { IsString, IsIn, IsNumber } from 'class-validator';


export class UpdateStatusDto {
    @IsString()
    readonly user_id: string;

    @IsString()
    @IsIn(['ongoing', 'success', 'failed'])
    readonly status: string;
}
