import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { DealsService } from './deals.service';
import { CreateDealDto, UpdateDealDto } from './dto/create-deal.dto';

@ApiTags('deals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('deals')
export class DealsController {
  constructor(private deals: DealsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.deals.list(user.id);
  }

  @Post()
  create(@Body() dto: CreateDealDto, @CurrentUser() user: AuthUser) {
    return this.deals.create(dto, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDealDto,
    @CurrentUser() user: AuthUser
  ) {
    return this.deals.update(id, dto, user.id);
  }
}
