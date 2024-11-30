import { IsDecimal, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsPositiveDecimal } from '../../common/validators/is-positive-decimal.decorator';
import { Transform } from 'class-transformer';

export class CreateProjectDto {
  @IsNotEmpty({ message: 'El nombre del proyecto no puede estar vacio' })
  @Transform(({ value }) => value.trim().toLowerCase())
  name: string;

  @IsOptional()
  @IsString({ message: 'El decimal debe ser una cadena de texto' })
  @IsDecimal({}, { message: 'El precio debe ser un entero o decimal' })
  @IsPositiveDecimal()
  @Transform(({ value }) => value?.trim())
  budget?: string;
}
