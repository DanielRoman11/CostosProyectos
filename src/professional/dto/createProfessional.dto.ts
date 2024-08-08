import { IsDecimal, IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class CreateProfessionalDto {
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @Length(3, 15, { message: 'El tamaño debe ser de 3 a 15 caracteres' })
  name: string;

  @IsNotEmpty({ message: 'La profesión no puede estar vacia' })
  @Length(3, 15, { message: 'El tamaño debe ser de 3 a 15 caracteres' })
  profession: string;

  @IsNotEmpty({ message: 'El precio unitario no puede estar vacío' })
  @IsDecimal(
    { decimal_digits: '2', locale: 'en-US' },
    {
      message: 'El precio unitario debe ser un número decimal con 2 decimales',
    },
  )
  unit_price: string;
}
