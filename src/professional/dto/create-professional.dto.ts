import { IsDecimal, IsNotEmpty, IsString, Length } from 'class-validator';
import { Staff } from '../../staff/entities/staff.entity';
import { IsPositiveDecimal } from '../../common/validators/is-positive-decimal.decorator';
import { Transform, Type } from 'class-transformer';

export class CreateProfessionalDto {
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @Length(3, 50, { message: 'Nombre de 3 a 50 caracteres' })
  @Transform(({ value }) => value?.trim().toLocaleLowerCase())
  name: string;

  @IsNotEmpty({ message: 'El precio unitario no puede estar vacío' })
  @IsString({ message: 'El decimal debe ser una cadena de texto' })
  @IsDecimal({}, { message: 'El precio debe ser un entero o decimal' })
  @IsPositiveDecimal()
  @Transform(({ value }) => value?.trim())
  unit_price: string;

  @IsNotEmpty({ message: 'Debes escoger un rol para este professional' })
  @Type(() => Staff)
  staff_id: number;
}
