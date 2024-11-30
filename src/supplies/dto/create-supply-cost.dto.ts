import {
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ItemQuantityDto } from './create-supply-item.dto';
import { UniqueArray } from '../../common/validators/unique-array-decorator';
import { Category } from '../../categories/entities/category.entity';

export class CreateSupplyCostDetailDto {
  @IsNotEmpty({
    message: 'Debe seleccionar los profesionales para calcular los costos',
  })
  @IsArray({
    message: 'Debe enviar un conjunto de profesionales con sus cantidades',
  })
  @ArrayNotEmpty({ message: 'Debe seleccionar al menos un profesional' })
  @ValidateNested({ each: true })
  @Type(() => ItemQuantityDto)
  @UniqueArray('supply')
  items: ItemQuantityDto[];

  @IsNotEmpty({ message: 'La categoria no puede estar vacia' })
  @Type(() => Category)
  category_id: Pick<Category, 'id'>;

  @IsNotEmpty({ message: 'La unidad de medida no puede estar vacía' })
  @IsString({ message: 'La unidad debe ser una cadena de texto' })
	@Transform(({ value }) => value?.trim().toLocaleLowerCase())
  unit: string;
}
