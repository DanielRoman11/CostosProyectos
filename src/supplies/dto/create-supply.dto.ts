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
      message: 'El precio unitario debe ser un número con 2 decimales',
    },
  )
  @IsPositiveDecimal()
  unit_price: string;

  @IsNotEmpty()
  category: Category;
}
