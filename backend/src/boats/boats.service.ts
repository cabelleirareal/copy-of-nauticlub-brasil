import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoatDto } from './dto/create-boat.dto';
import { UpdateBoatDto } from './dto/update-boat.dto';
import { ListBoatsDto } from './dto/list-boats.dto';
import { AuthUser } from '../common/decorators/current-user.decorator';

@Injectable()
export class BoatsService {
  constructor(private prisma: PrismaService) {}

  async list(filters: ListBoatsDto) {
    const where: Prisma.BoatWhereInput = {
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.status ? { status: filters.status } : { status: 'AVAILABLE' }),
      ...(filters.size_min || filters.size_max
        ? {
            size: {
              ...(filters.size_min ? { gte: filters.size_min } : {}),
              ...(filters.size_max ? { lte: filters.size_max } : {}),
            },
          }
        : {}),
      ...(filters.price_min || filters.price_max
        ? {
            price: {
              ...(filters.price_min ? { gte: filters.price_min } : {}),
              ...(filters.price_max ? { lte: filters.price_max } : {}),
            },
          }
        : {}),
      ...(filters.location ? { location: { contains: filters.location, mode: 'insensitive' } } : {}),
      ...(filters.search
        ? {
            OR: [
              { name: { contains: filters.search, mode: 'insensitive' } },
              { brand: { contains: filters.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.boat.findMany({
        where,
        skip: filters.skip,
        take: filters.limit,
        include: { media: { orderBy: { order: 'asc' } } },
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.boat.count({ where }),
    ]);

    return {
      data,
      pagination: {
        skip: filters.skip,
        limit: filters.limit,
        total,
        hasMore: filters.skip + data.length < total,
      },
    };
  }

  async findOne(id: string) {
    const boat = await this.prisma.boat.findUnique({
      where: { id },
      include: {
        media: { orderBy: { order: 'asc' } },
        owner: { select: { id: true, name: true, avatar: true } },
        listingBroker: { select: { id: true, name: true, avatar: true } },
      },
    });
    if (!boat) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Boat not found' });
    }
    await this.prisma.boat.update({ where: { id }, data: { views: { increment: 1 } } });
    return boat;
  }

  async create(dto: CreateBoatDto, user: AuthUser) {
    const ownerId = dto.ownerId ?? user.id;
    const isBroker = user.role === Role.BROKER;

    return this.prisma.boat.create({
      data: {
        name: dto.name,
        brand: dto.brand,
        year: dto.year,
        size: dto.size,
        price: dto.price,
        type: dto.type,
        status: dto.status ?? 'AVAILABLE',
        description: dto.description,
        location: dto.location,
        marina: dto.marina,
        specs: dto.specs,
        openToPartnerships: dto.openToPartnerships ?? false,
        defaultCommission: dto.defaultCommission ?? 5.0,
        featured: dto.featured ?? false,
        ownerId,
        listingBrokerId: isBroker ? user.id : null,
      },
      include: { media: true },
    });
  }

  async update(id: string, dto: UpdateBoatDto, user: AuthUser) {
    await this.assertCanModify(id, user);
    return this.prisma.boat.update({
      where: { id },
      data: dto as any,
      include: { media: true },
    });
  }

  async remove(id: string, user: AuthUser) {
    await this.assertCanModify(id, user);
    await this.prisma.boat.delete({ where: { id } });
    return { ok: true };
  }

  private async assertCanModify(id: string, user: AuthUser) {
    const boat = await this.prisma.boat.findUnique({ where: { id } });
    if (!boat) {
      throw new NotFoundException({ code: 'NOT_FOUND', message: 'Boat not found' });
    }
    const allowed =
      user.role === Role.ADMIN ||
      boat.ownerId === user.id ||
      boat.listingBrokerId === user.id;
    if (!allowed) {
      throw new ForbiddenException({
        code: 'FORBIDDEN',
        message: 'You cannot modify this boat',
      });
    }
    return boat;
  }
}
