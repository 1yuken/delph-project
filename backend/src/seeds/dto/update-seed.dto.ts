import { PartialType } from '@nestjs/swagger';
import { CreateSeedDto } from './create-seed.dto';

export class UpdateSeedDto extends PartialType(CreateSeedDto) {}
