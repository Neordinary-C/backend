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

  getSuccessDays(userId: string, status: string) {
    //DB 처리
    //각종 로직 모두 여기서 처리

    return {
      ok: true,
    };
  }
}
