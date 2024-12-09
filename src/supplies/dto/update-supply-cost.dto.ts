import { PartialType } from '@nestjs/mapped-types';
import { CreateSupplyCostDetailDto } from './create-supply-cost.dto';

export default class UpdateSupplyCostDto extends PartialType(
  CreateSupplyCostDetailDto,
) {}
