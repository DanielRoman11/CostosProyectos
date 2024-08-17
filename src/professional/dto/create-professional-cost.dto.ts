import {
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
	IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ItemQuantityDto } from './create-professional-item.dto';
import { UniqueArray } from '../../common/validators/unique-array-decorator';

export class CreateProfessionalCostDetailDto {
  @IsNotEmpty({
    message: 'Debe seleccionar los profesionales para calcular los costos',
  })
  @IsArray({
    message: 'Debe enviar un conjunto de profesionales con sus cantidades',
  })
  @ArrayNotEmpty({ message: 'Debe seleccionar al menos un profesional' })
  @ValidateNested({ each: true })
  @Type(() => ItemQuantityDto)
  @UniqueArray('professional')
  items: ItemQuantityDto[];

  @IsNotEmpty({ message: 'La unidad de medida no puede estar vacía' })
	@IsString({ message: 'La unidad debe ser una cadena de texto' })
  unit: string;
}
