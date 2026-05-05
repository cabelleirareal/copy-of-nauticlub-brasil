import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BoatsService } from './boats.service';
import { CreateBoatDto } from './dto/create-boat.dto';
import { UpdateBoatDto } from './dto/update-boat.dto';
import { ListBoatsDto } from './dto/list-boats.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';

@ApiTags('boats')
@Controller('boats')
@UseGuards(JwtAuthGuard)
export class BoatsController {
  constructor(private boats: BoatsService) {}

  @Public()
  @Get()
  list(@Query() filters: ListBoatsDto) {
    return this.boats.list(filters);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boats.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  create(@Body() dto: CreateBoatDto, @CurrentUser() user: AuthUser) {
    return this.boats.create(dto, user);
  }

  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() dto: UpdateBoatDto, @CurrentUser() user: AuthUser) {
    return this.boats.update(id, dto, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.boats.remove(id, user);
  }
}
