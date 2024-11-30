import {
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { IsPositiveDecimal } from '../../common/validators/is-positive-decimal.decorator';
import { Transform } from 'class-transformer';

export class CreateSupplyDto {
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @Length(3, 50, {
    message: 'Nombre de 3 a 50 caracteres',
  })
  @Transform(({ value }) => value?.trim().toLocaleLowerCase())
  name: string;

  @IsOptional()
  @Length(5, 250, {
    message: 'Descripción de 5 a 250 caracteres',
  })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @IsNotEmpty({ message: 'El precio unitario no puede estar vacío' })
  @IsString({ message: 'El decimal debe ser una cadena de texto' })
  @IsDecimal({}, { message: 'El precio debe ser un entero o decimal' })
  @IsPositiveDecimal()
  @Transform(({ value }) => value?.trim().toLocaleLowerCase())
  unit_price: string;
}
