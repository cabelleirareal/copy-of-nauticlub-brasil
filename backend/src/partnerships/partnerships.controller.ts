import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { PartnershipsService } from './partnerships.service';

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
}
