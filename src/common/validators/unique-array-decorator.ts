import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'uniqueArray', async: false })
class UniqueArrayConstraint implements ValidatorConstraintInterface {
  validate(items: any[], args: ValidationArguments): boolean {
    if (!Array.isArray(items)) {
      return true;
    }
    const property = args.constraints[0];
    const seenValues = new Set();

    for (const item of items) {
      const value = item[property];
      if (seenValues.has(value)) {
        return false;
      }
      seenValues.add(value);
    }
    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    const property = args.constraints[0];
    return `Los valores del campo '${property}' no deben estar repetidos.`;
  }
}

export function UniqueArray(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'uniqueArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: UniqueArrayConstraint,
    });
  };
}
