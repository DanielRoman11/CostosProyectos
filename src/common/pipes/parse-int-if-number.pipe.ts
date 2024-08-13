import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseNumberOrUuidPipe implements PipeTransform {
  private static readonly UUID_V4_REGEX =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  transform(value: any): number | string {
    if (value) {
      if (!isNaN(Number(value))) {
        const intValue = parseInt(value, 10);
        if (isNaN(intValue)) {
          throw new BadRequestException('Esto no es un número válido');
        }
        return intValue;
      }

      if (ParseNumberOrUuidPipe.UUID_V4_REGEX.test(value)) {
        return value;
      }

      throw new BadRequestException('Esto no es un número ni un UUID valido.');
    }
    return value;
  }
}
