import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BoatStatus, BoatType } from '@prisma/client';

export class CreateBoatDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() brand: string;
  @ApiProperty() @IsInt() @Min(1900) @Max(2100) year: number;
  @ApiProperty() @IsNumber() @Min(0) size: number;
  @ApiProperty() @IsNumber() @Min(0) price: number;
  @ApiProperty({ enum: BoatType }) @IsEnum(BoatType) type: BoatType;
  @ApiPropertyOptional({ enum: BoatStatus }) @IsOptional() @IsEnum(BoatStatus) status?: BoatStatus;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() marina?: string;
  @ApiProperty() @IsObject() specs: Record<string, any>;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() openToPartnerships?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsNumber() defaultCommission?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() featured?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerId?: string;
}
