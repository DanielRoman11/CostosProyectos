import { IsDecimal, IsNotEmpty, IsOptional } from 'class-validator';
import { IsPositiveDecimal } from '../../common/validators/is-positive-decimal.decorator';

export class CreateProjectDto {
  @IsNotEmpty({ message: 'El nombre del proyecto no puede estar vacio' })
  name: string;

  @IsOptional()
  @IsDecimal(
    { decimal_digits: '2', locale: 'en-US' },
    {
      message: 'El precio debe ser un entero o tener 2 décimas',
    },
  )
  @IsPositiveDecimal()
  budget?: string;
}
