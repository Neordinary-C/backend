import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ShortsService } from './shorts.service';

@ApiTags('shorts')
@Controller('shorts')
export class ShortsController {
  constructor(private readonly shortsService: ShortsService) {}

  @ApiOperation({ summary: 'Get all categories' })
  @Get('/categories')
  getAllCategories() {
    return this.shortsService.getAllCategories();
  }
}
