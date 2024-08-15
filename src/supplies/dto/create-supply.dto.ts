import { IsDecimal, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { IsPositiveDecimal } from '../../common/validators/is-positive-decimal.decorator';
import { Category } from '../../categories/entities/category.entity';

export class CreateSupplyDto {
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @Length(3, 20, {
    message: 'Nombre de 3 a 20 caracteres',
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
      message: 'Precio debe ser de 2 décimas o sin decimas',
    },
  )
  @IsPositiveDecimal()
  unit_price: string;

  @IsNotEmpty()
  category_id: Category;
}
