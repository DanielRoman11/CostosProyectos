import { IsNotEmpty, IsDecimal, IsString } from 'class-validator';
import { Supply } from '../entities/supply.entity';

export class ItemQuantityDto {
  @IsNotEmpty({ message: 'El ID del suministro no puede estar vacío' })
  supply: Pick<Supply, 'id'>;

  @IsNotEmpty({ message: 'La cantidad no puede estar vacía' })
  @IsString({ message: 'El decimal debe ser una cadena de texto' })
  @IsDecimal({}, { message: 'La cantidad debe ser un entero o decimal' })
  quantity: string;
}
