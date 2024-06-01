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
import { UpdateStatusDto } from './dto/update-status.dto';

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

  @ApiOperation({ summary: 'Get user timer status' })
  @Get('/timer/status')
  getUserTimerStatus(
    @Query('userId') user_id: string
  ) {
    return this.userService.getUserTimerStatus(user_id);
  }

  @ApiOperation({ summary: 'Get user timer set times' })
  @Get('/timer/time')
  getUserTimerTimes(
    @Query('userId') user_id: string
  ) {
    return this.userService.getUserTimerTimes(user_id);
  }

  @ApiOperation({ summary: 'Get mypage datas' })
  @Get('/my')
  getMypage(
    @Query('userId') user_id: string
  ) {
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
    UpdateTimerStatus(@Body() UpdateStatusDto: UpdateStatusDto
  ) {
    return this.userService.updateTimerStatus(UpdateStatusDto);
  }


}
