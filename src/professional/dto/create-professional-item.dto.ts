import { IsNotEmpty, IsDecimal } from 'class-validator';
import { Professional } from '../entities/profesional.entity';

export class ItemQuantityDto {
  @IsNotEmpty({ message: 'El ID del profesional no puede estar vacío' })
  professional: Pick<Professional, 'id'>;

  @IsNotEmpty({ message: 'La cantidad no puede estar vacía' })
  @IsDecimal(
    { decimal_digits: '2', locale: 'en-US' },
    {
      message: 'La cantidad debe ser un entero o tener 2 décimas',
    },
  )
  quantity: string;
}
