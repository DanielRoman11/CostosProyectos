import { IsDecimal, IsNotEmpty } from 'class-validator';
import { IsPositiveDecimal } from '../../common/validators/is-positive-decimal.decorator';
import { Category } from '../../categories/entities/category.entity';

export class CreateSupplyDto {
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  name: string;

  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  description: string;

  @IsNotEmpty({ message: 'El precio unitario no puede estar vacío' })
  @IsDecimal(
    { decimal_digits: '2', locale: 'en-US' },
    {
      message: 'Debe ingresar un número decimal de 2 décimas',
    },
  )
  @IsPositiveDecimal()
  unit_price: string;

  @IsNotEmpty()
  category_id: Category;
}
