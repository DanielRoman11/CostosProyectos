import {
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsString,
  IsOptional,
  Length,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
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

  @Length(3, 60, {
    message: 'Descripción corta de máximo 60 caracteres',
  })
  @IsString()
  @Transform(({ value }) => value?.trim().tolowerCase())
  description: string;

  @IsNotEmpty({ message: 'La unidad de medida no puede estar vacía' })
  @IsString({ message: 'La unidad debe ser una cadena de texto' })
  @Transform(({ value }) => value?.trim())
  unit: string;
}
