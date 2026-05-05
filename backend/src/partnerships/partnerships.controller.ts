import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { PartnershipsService } from './partnerships.service';
import { CreatePartnershipDto, UpdatePartnershipDto } from './dto/create-partnership.dto';

@ApiTags('partnerships')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('partnerships')
export class PartnershipsController {
  constructor(private partnerships: PartnershipsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.partnerships.list(user.id);
  }

  @Post()
  create(
    @Body() dto: CreatePartnershipDto,
    @CurrentUser() user: AuthUser
  ) {
    return this.partnerships.create(dto, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePartnershipDto,
    @CurrentUser() user: AuthUser
  ) {
    return this.partnerships.update(id, dto, user.id);
  }
}
