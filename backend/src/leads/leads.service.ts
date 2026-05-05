import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { AuthUser } from '../common/decorators/current-user.decorator';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLeadDto) {
    let assignedBrokerId: string | null = null;
    let boatExists = false;

    if (dto.boatId) {
      const boat = await this.prisma.boat.findUnique({
        where: { id: dto.boatId },
        select: { id: true, listingBrokerId: true },
      });
      if (boat) {
        boatExists = true;
        assignedBrokerId = boat.listingBrokerId ?? null;
      }
    }

    return this.prisma.lead.create({
      data: {
        boatId: boatExists ? dto.boatId : null,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        message: dto.message,
        type: dto.type ?? 'INTEREST',
        source: assignedBrokerId ? 'LISTING_BROKER' : 'ORGANIC',
        assignedBrokerId,
      },
    });
  }

  async list(user: AuthUser, filters: { boatId?: string; status?: string; skip?: number; limit?: number }) {
    const skip = filters.skip ?? 0;
    const limit = filters.limit ?? 50;
    const where: any = {
      ...(user.role === Role.ADMIN ? {} : { assignedBrokerId: user.id }),
      ...(filters.boatId ? { boatId: filters.boatId } : {}),
      ...(filters.status ? { status: filters.status } : {}),
    };
    const [data, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { boat: { select: { id: true, name: true, price: true } } },
      }),
      this.prisma.lead.count({ where }),
    ]);
    return { data, pagination: { skip, limit, total, hasMore: skip + data.length < total } };
  }

  async update(id: string, dto: UpdateLeadDto, user: AuthUser) {
    const lead = await this.prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new NotFoundException({ code: 'NOT_FOUND', message: 'Lead not found' });
    if (user.role !== Role.ADMIN && lead.assignedBrokerId !== user.id) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'You cannot modify this lead',
      });
    }
    return this.prisma.lead.update({
      where: { id },
      data: dto as any,
    });
  }
}
