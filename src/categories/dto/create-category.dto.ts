import { Transform } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'El nombre de la categoria no puede estar vacío' })
  @Length(4, 50, {
    message: 'El nombre de la categoria debe estar entre 4 a 25 caracteres',
  })
	@Transform(({ value }) => value?.trim().toLocaleLowerCase())
  name: string;
}
