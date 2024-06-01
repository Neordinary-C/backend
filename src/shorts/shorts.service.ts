import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ShortsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllCategories() {
    const categories = await this.databaseService.category.findMany();

    return {
      success: 'ok',
      categories,
    };
  }
}
