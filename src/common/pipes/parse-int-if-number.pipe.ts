import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseNumberOrUuidPipe implements PipeTransform {
  // Expresión regular para validar UUID v4
  private static readonly UUID_V4_REGEX =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

  transform(value: any): number | string {
    if (value) {
      // Primero, intenta parsear a número
      if (!isNaN(Number(value))) {
        const intValue = parseInt(value, 10);
        if (isNaN(intValue)) {
          throw new BadRequestException('Esto no es un número válido');
        }
        return intValue;
      }

      // Si no es un número, verifica si es un UUID válido
      if (ParseNumberOrUuidPipe.UUID_V4_REGEX.test(value)) {
        return value; // Retorna el UUID como está si es válido
      }

      // Si no es ni un número ni un UUID válido, lanza una excepción
      throw new BadRequestException(
        'No es un número o UUID valido.',
      );
    }
    return value;
  }
}
