import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'uniqueArray', async: false })
class UniqueArrayConstraint implements ValidatorConstraintInterface {
  constructor(private readonly property: string) {}

  validate(items: any[]): boolean {
    const seenValues = new Set();
    for (const item of items) {
      const value = item[this.property];
      if (seenValues.has(value)) {
        return false;
      }
      seenValues.add(value);
    }
    return true;
  }

  defaultMessage(): string {
    return `Los valores del campo '${this.property}' no deben estar repetidos.`;
  }
}

export function UniqueArray(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'uniqueArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UniqueArrayConstraint,
      constraints: [property],
    });
  };
}
