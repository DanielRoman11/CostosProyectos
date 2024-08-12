import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntIfNumberPipe implements PipeTransform {
  transform(value: any): number | any {
    if (value && !isNaN(Number(value))) {
      const intValue = parseInt(value, 10);
      if (isNaN(intValue)) {
        throw new BadRequestException('Validation failed. Not a number.');
      }
      return intValue;
    }
    return value; // Return as is if it's not a number
  }
}
