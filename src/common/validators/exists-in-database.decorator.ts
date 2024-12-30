import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ItemQuantityDto } from '../../supplies/dto/create-supply-item.dto';
import { SuppliesService } from '../../supplies/supplies.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class ExistInSupplyCostConstraint
  implements ValidatorConstraintInterface
{
  constructor(private supplyService: SuppliesService) {}

  async validate(value: any): Promise<boolean> {
    const items: ItemQuantityDto[] = value;
    const supplies = await this.supplyService.findCostByIds(
      items.map((item) => {
        return item.supply;
      }),
    );
    console.log(supplies);
    return supplies.length === items.length;
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `Algunos argumentos de ${validationArguments.property} no existe en los suministros.`;
  }
}

export function ExistInSupplyCost(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ExistInSupplyCostConstraint,
      async: true,
    });
  };
}
