import { Controller, Post, Body, Query, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { NewTimerAndShortsDto } from './dto/new-timer-and-shorts.dto';
import { StartTimerDto } from './dto/user-timer.dto';
import { UpdateNumberDto } from './dto/update-number.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

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

  @ApiOperation({ summary: 'Get user timer status' })
  @Get('/timer/status')
  getUserTimerStatus(@Query('userId') user_id: string) {
    return this.userService.getUserTimerStatus(user_id);
  }

  @ApiOperation({ summary: 'Get user timer set times' })
  @Get('/timer/time')
  getUserTimerTimes(@Query('userId') user_id: string) {
    return this.userService.getUserTimerTimes(user_id);
  }

  @ApiOperation({ summary: 'Get mypage datas' })
  @Get('/my')
  getMypage(@Query('userId') user_id: string) {
    return this.userService.getMypage(user_id);
  }

  @ApiOperation({ summary: 'Get success days' })
  @Get('/timer')
  getSuccessDays(
    @Query('userId') user_id: string,
    @Query('status') status: string,
  ) {
    return this.userService.getSuccessDays(user_id, status);
  }

  @ApiOperation({ summary: 'Change timer status' })
  @Patch('/timer/status')
  UpdateTimerStatus(@Body() UpdateStatusDto: UpdateStatusDto) {
    return this.userService.updateTimerStatus(UpdateStatusDto);
  }

  @Get('/shorts/count')
  getShortsSeenNumber(@Query('userId') user_id: string) {
    return this.userService.getShortsSeenNumber(user_id);
  }

  @Get('/timer')
  getPlanTimer(@Query('userId') user_id: string) {
    return this.userService.getPlanTimer(user_id);
  }

  @Post('/timer')
  startTime(@Body() startTimeDto: StartTimerDto) {
    return this.userService.startTime(startTimeDto);
  }

  @Patch('/shorts/count')
  updateSeenNumber(@Body() updateNumberDto: UpdateNumberDto) {
    return this.userService.updateSeenNumber(updateNumberDto);
  }
}
