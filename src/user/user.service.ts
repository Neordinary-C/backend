import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

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
        end_time: {
          lt: threeMonthsAgo
        }
      }
    });
    const successDays = userTimers.map(timer => timer.end_time);
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
      "user_score": user.total_score,
      "user_shortscount": user.total_count,
      "user_total_time_h": user.total_timer_h,
      "user_total_time_m": user.total_timer_m
  };
  }
  
}
