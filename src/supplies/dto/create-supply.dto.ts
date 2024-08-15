import { IsDecimal, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { IsPositiveDecimal } from '../../common/validators/is-positive-decimal.decorator';
import { Category } from '../../categories/entities/category.entity';

export class CreateSupplyDto {
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @Length(3, 50, {
    message: 'Nombre de 3 a 50 caracteres',
  })
  name: string;

  @IsOptional()
  @Length(5, 250, {
    message: 'Descripción de 5 a 250 caracteres',
  })
  description: string;

  @IsNotEmpty({ message: 'El precio unitario no puede estar vacío' })
  @IsDecimal(
    { decimal_digits: '2', locale: 'en-US' },
    {
      message: 'El precio debe ser un entero o tener 2 décimas',
    },
  )
  @IsPositiveDecimal()
  unit_price: string;

  @IsNotEmpty({ message: 'La categoria no puede estar vacia' })
  category_id: Category;
}
