import { Transform } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateStaffDto {
  @IsNotEmpty({ message: 'El nombre no puede estar vacio' })
  @Length(3, 50, {
    message: 'Nombre de 3 a 50 caracteres',
  })
  @Transform(({ value }) => value?.trim().toLocaleLowerCase())
  name: string;
}
