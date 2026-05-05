import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PartnershipStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  REVOKED = 'REVOKED',
  COMPLETED = 'COMPLETED',
}

export class CreatePartnershipDto {
  @ApiProperty({ description: 'Boat ID' })
  @IsString()
  boatId: string;

  @ApiProperty({ description: 'Partner broker ID' })
  @IsString()
  partnerBrokerId: string;

  @ApiProperty({ description: 'Initial status', enum: PartnershipStatus, required: false })
  @IsOptional()
  @IsEnum(PartnershipStatus)
  status?: PartnershipStatus;
}

export class UpdatePartnershipDto {
  @ApiProperty({ description: 'New status', enum: PartnershipStatus, required: false })
  @IsOptional()
  @IsEnum(PartnershipStatus)
  status?: PartnershipStatus;
}
