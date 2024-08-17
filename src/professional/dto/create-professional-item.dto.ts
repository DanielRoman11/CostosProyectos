import { IsNotEmpty, IsDecimal, IsString } from 'class-validator';
import { Professional } from '../entities/profesional.entity';

export class ItemQuantityDto {
  @IsNotEmpty({ message: 'El ID del profesional no puede estar vacío' })
  professional: Pick<Professional, 'id'>;

  @IsNotEmpty({ message: 'La cantidad no puede estar vacía' })
  @IsString({ message: 'El decimal debe ser una cadena de texto' })
  @IsDecimal({}, { message: 'La cantidad debe ser un entero o decimal' })
  quantity: string;
}
