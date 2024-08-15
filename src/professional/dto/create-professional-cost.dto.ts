import { IsDecimal, IsNotEmpty } from 'class-validator';
import { IsPositiveDecimal } from '../../common/validators/is-positive-decimal.decorator';
import { Professional } from '../entities/profesional.entity';
import { Project } from 'src/projects/entities/project.entity';

export class CreateProfessionalCostDetailDto {
  @IsNotEmpty({ message: 'Debe seleccionar un projecto obligatoriamente' })
  project: Project;

  @IsNotEmpty({
    message: 'Debe seleccionar los profesionales para calcular los costos',
  })
  professional_ids: Pick<Professional, 'id'>[];

  @IsNotEmpty({ message: 'El precio unitario no puede estar vacío' })
  @IsDecimal(
    { decimal_digits: '2', locale: 'en-US' },
    {
      message: 'El precio debe ser un entero o tener 2 décimas',
    },
  )
  @IsPositiveDecimal()
  quantity: string;

  @IsNotEmpty({ message: 'La unidad de medida no puede estar vacia' })
  unit: string;
}
