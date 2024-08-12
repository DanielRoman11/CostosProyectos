import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isPositiveDecimal', async: false })
class IsPositiveDecimalConstraint implements ValidatorConstraintInterface {
  validate(value: string): Promise<boolean> | boolean {
    const numberValue = parseFloat(value);
    return !isNaN(numberValue) && numberValue > 0;
  }
  defaultMessage?(): string {
    throw new Error('El valor debe ser un número decimal positivo.');
  }
}

export function IsPositiveDecimal(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPositiveDecimal',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPositiveDecimalConstraint,
    });
  };
}
