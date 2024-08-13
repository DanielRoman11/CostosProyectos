import { IsDecimal, IsNotEmpty, IsOptional } from 'class-validator';
import { IsPositiveDecimal } from '../../common/validators/is-positive-decimal.decorator';

export class CreateProjectDto {
  @IsNotEmpty({ message: 'El nombre del proyecto no puede estar vacio' })
  name: string;

  @IsOptional()
  @IsDecimal(
    { decimal_digits: '2' },
    { message: 'El número debe ser un decimal' },
  )
  @IsPositiveDecimal()
  budget?: string;
}
