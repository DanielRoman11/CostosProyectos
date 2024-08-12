import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { ParseIntIfNumberPipe } from 'src/common/pipes/parse-int-if-number.pipe';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntIfNumberPipe()) id: Pick<Category, 'id'>) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseIntIfNumberPipe()) id: Pick<Category, 'id'>,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntIfNumberPipe()) id: Pick<Category, 'id'>) {
    return this.categoriesService.remove(id);
  }
}
