import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LeadType } from '@prisma/client';

export class CreateLeadDto {
  @ApiPropertyOptional() @IsOptional() @IsString() boatId?: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() phone: string;
  @ApiPropertyOptional() @IsOptional() @IsString() message?: string;
  @ApiPropertyOptional({ enum: LeadType, default: LeadType.INTEREST })
  @IsOptional()
  @IsEnum(LeadType)
  type?: LeadType = LeadType.INTEREST;
}
