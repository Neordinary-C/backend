import { Controller, Post, Body, Query, Get } from '@nestjs/common';
import { UserService } from './user.service';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { NewTimerAndShortsDto } from './dto/new-timer-and-shorts.dto';

@ApiTags('users')
@Controller('users') // localhost:3000/api/users
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Creates a new user.' })
  @Post('/signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/timer/new')
  saveNewTimerAndShorts(@Body() newTimerAndShorts: NewTimerAndShortsDto) {
    return this.userService.saveNewTimerAndShorts(newTimerAndShorts);
  }

  @Get('/timer/count')
  getShortsCount(@Query('userId') user_id: string) {
    return this.userService.getShortsCount(user_id);
  }

  @Get('/shorts')
  getShorts(@Query('userId') user_id: string) {
    return this.userService.getShorts(user_id);
  }
}
