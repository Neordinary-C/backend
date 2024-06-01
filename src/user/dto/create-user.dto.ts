import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly user_id: string;
  @IsString()
  readonly name: string;
  @IsString()
  readonly password: string;
}
