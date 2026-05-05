import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BoatStatus, BoatType } from '@prisma/client';

export class ListBoatsDto {
  @ApiPropertyOptional({ enum: BoatType }) @IsOptional() @IsEnum(BoatType) type?: BoatType;
  @ApiPropertyOptional({ enum: BoatStatus }) @IsOptional() @IsEnum(BoatStatus) status?: BoatStatus;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() size_min?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() size_max?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() price_min?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() price_max?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip: number = 0;
  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
