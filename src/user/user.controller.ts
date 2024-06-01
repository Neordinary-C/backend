import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

@ApiTags('users')
@Controller('users') // localhost:3000/api/users
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Creates a new user.' })
  @Post() //POST
  create(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get a new user.' })
  @Get() //GET
  findAll() {
    return this.userService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('/shorts')
  getShortsSeenNumber(@Query('userId') user_id: string){
    return this.userService.getShortsSeenNumber(user_id);
  }

  @Get('/timer')
  getPlanTimer(@Query('userId') user_id:string){
    return this.userService.getPlanTimer(user_id)
  }
}
