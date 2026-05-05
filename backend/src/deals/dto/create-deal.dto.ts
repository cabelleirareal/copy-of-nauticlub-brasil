import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum DealStatus {
  PENDING = 'PENDING',
  NEGOTIATING = 'NEGOTIATING',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

export class CreateDealDto {
  @ApiProperty({ description: 'Boat ID' })
  @IsString()
  boatId: string;

  @ApiProperty({ description: 'Lead ID' })
  @IsString()
  leadId: string;

  @ApiProperty({ description: 'Buyer ID' })
  @IsString()
  buyerId: string;

  @ApiProperty({ description: 'Negotiated price' })
  @IsNumber()
  negotiatedPrice: number;

  @ApiProperty({ description: 'Initial status', enum: DealStatus, required: false })
  @IsOptional()
  @IsEnum(DealStatus)
  status?: DealStatus;
}

export class UpdateDealDto {
  @ApiProperty({ description: 'New status', enum: DealStatus, required: false })
  @IsOptional()
  @IsEnum(DealStatus)
  status?: DealStatus;

  @ApiProperty({ description: 'New negotiated price', required: false })
  @IsOptional()
  @IsNumber()
  negotiatedPrice?: number;
}
