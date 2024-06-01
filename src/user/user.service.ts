import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: Prisma.UserCreateInput) {
    await this.databaseService.user.create({
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

  getSuccessDays(userId: string, status: string) {
    //DB 처리
    //각종 로직 모두 여기서 처리

    return {
      ok: true,
    };
  }
  async getShortsSeenNumber(userId: string) {
    const user=await this.databaseService.user.findFirst({where:{
      user_id: userId
    }})
    const userShorts=await this.databaseService.userShorts.findFirst({where:{
        user_id: user.id
      }
    })
    return {
      success: "ok",
      number: userShorts.watched_count?userShorts.watched_count:0
    };
  }

  async getPlanTimer(userId:string){
    const user=await this.databaseService.user.findFirst({where:{
      user_id:userId
    }})
    const user_timer=await this.databaseService.userTimer.findFirst({where:{
      user_id:user.id
    }
    })
    return{
      success:"ok",
      time_h:user_timer ? user_timer.timer_h :0,
      time_m:user_timer ? user_timer.timer_m :0
    }
  }
}
