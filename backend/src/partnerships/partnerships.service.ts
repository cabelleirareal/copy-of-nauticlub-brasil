import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePartnershipDto, UpdatePartnershipDto } from './dto/create-partnership.dto';

@Injectable()
export class PartnershipsService {
  constructor(private prisma: PrismaService) {}

  async list(userId: string) {
    return this.prisma.partnership.findMany({
      where: { partnerBrokerId: userId },
      include: {
        boat: {
          include: {
            owner: {
              select: { id: true, name: true, avatar: true },
            },
            listingBroker: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
        partnerBroker: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
  }

  async create(dto: CreatePartnershipDto, userId: string) {
    const boat = await this.prisma.boat.findUnique({
      where: { id: dto.boatId },
    });

    if (!boat) {
      throw new NotFoundException('Boat not found');
    }

    const partnerBroker = await this.prisma.user.findUnique({
      where: { id: dto.partnerBrokerId },
    });

    if (!partnerBroker) {
      throw new NotFoundException('Partner broker not found');
    }

    return this.prisma.partnership.create({
      data: {
        boatId: dto.boatId,
        partnerBrokerId: dto.partnerBrokerId,
        listingBrokerId: userId,
        status: dto.status || 'PENDING',
        terms: {},
      },
      include: {
        boat: {
          include: {
            owner: {
              select: { id: true, name: true, avatar: true },
            },
            listingBroker: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
        partnerBroker: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
  }

  async update(id: string, dto: UpdatePartnershipDto, userId: string) {
    const partnership = await this.prisma.partnership.findUnique({
      where: { id },
      include: {
        boat: true,
      },
    });

    if (!partnership) {
      throw new NotFoundException('Partnership not found');
    }

    const isListingBroker = partnership.listingBrokerId === userId;
    const isPartnerBroker = partnership.partnerBrokerId === userId;

    if (!isListingBroker && !isPartnerBroker) {
      throw new ForbiddenException(
        'You do not have permission to update this partnership'
      );
    }

    return this.prisma.partnership.update({
      where: { id },
      data: {
        status: dto.status,
      },
      include: {
        boat: {
          include: {
            owner: {
              select: { id: true, name: true, avatar: true },
            },
            listingBroker: {
              select: { id: true, name: true, avatar: true },
            },
          },
        },
        partnerBroker: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
  }
}
