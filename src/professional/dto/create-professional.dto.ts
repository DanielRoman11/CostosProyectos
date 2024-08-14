import { IsDecimal, IsNotEmpty, Length } from 'class-validator';
import { Staff } from '../../staff/entities/staff.entity';
import { IsPositiveDecimal } from '../../common/validators/is-positive-decimal.decorator';

export class CreateProfessionalDto {
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @Length(3, 15, { message: 'El tamaño debe ser de 3 a 15 caracteres' })
  name: string;

  @IsNotEmpty({ message: 'El precio unitario no puede estar vacío' })
  @IsDecimal(
    { decimal_digits: '2', locale: 'en-US' },
    {
      message: 'Debe ingresar un número decimal de 2 décimas',
    },
  )
  @IsPositiveDecimal()
  unit_price: string;

  @IsNotEmpty({ message: 'Debes escoger un rol para este professional' })
  staff_id: Pick<Staff, 'id'>;
}
