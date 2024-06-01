import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  create(createUserDto: Prisma.UserCreateInput) {
    this.databaseService.user.create({
      data: createUserDto,
    });

    return {
      status: 'success',
    };
  }

  findAll() {
    return 'hi';
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getUserTimerStatus(userId) {
    const users = await this.databaseService.userTimer.findMany({
      where: {user_id: +userId}});
    const user = users.pop();
    return {
      "success": "ok",
      "status": user.status
  };
  }

  async getUserTimerTimes(userId) {
    const users = await this.databaseService.userTimer.findMany({
      where: {user_id: +userId}});
    const user = users.pop();
    return {
      "success": "ok",
      "start_time": user.start_time,
      "timer_hour": user.timer_h,
      "timer_minuate": user.timer_m
  };
  }

  async getSuccessDays(userId, status) {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth()-3);

    const userTimers = await this.databaseService.userTimer.findMany({
      where: {
        user_id: +userId,
        status: status,
        }
      }
    );
    console.log(userTimers);
    const successDays = userTimers
    .filter((u) => u.start_time >= threeMonthsAgo)
    .map(timer => timer.start_time);

    console.log(successDays)
    return {
      "success": "ok",
      "days": successDays
  };
  }

  async getMypage(userId) {
    const user = await this.databaseService.userStat.findFirst({
      where: { user_id: +userId }
    });
    return {
      "success": "ok",
      "user_score": user.total_score.toString(),
      "user_shortscount": user.total_count.toString(),
      "user_total_time_h": user.total_timer_h.toString(),
      "user_total_time_m": user.total_timer_m.toString()
  };
  }

  async updateTimerStatus(UpdateStatusDto: UpdateStatusDto) {
    console.log(UpdateStatusDto)
    const users = await this.databaseService.userTimer.findMany({
      where: {
        user_id: +UpdateStatusDto.user_id
      }
    });
    const user = users.pop()
    console.log(user)

    await this.databaseService.userTimer.updateMany(
      {
        where: {
          user_id: +user.user_id
        },
        data: {
          status: UpdateStatusDto.status
      }
  });
}}
