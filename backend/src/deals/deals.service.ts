import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDealDto, UpdateDealDto } from './dto/create-deal.dto';

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  async list(userId: string) {
    return this.prisma.deal.findMany({
      where: {
        OR: [
          { boat: { listingBrokerId: userId } },
          { boat: { ownerId: userId } },
          { buyerId: userId },
        ],
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
        lead: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        buyer: {
          select: { id: true, name: true, avatar: true, email: true },
        },
      },
    });
  }

  async create(dto: CreateDealDto, userId: string) {
    const boat = await this.prisma.boat.findUnique({
      where: { id: dto.boatId },
    });

    if (!boat) {
      throw new NotFoundException('Boat not found');
    }

    if (boat.listingBrokerId !== userId) {
      throw new ForbiddenException('Only the listing broker can create deals');
    }

    const lead = await this.prisma.lead.findUnique({
      where: { id: dto.leadId },
    });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    const buyer = await this.prisma.user.findUnique({
      where: { id: dto.buyerId },
    });

    if (!buyer) {
      throw new NotFoundException('Buyer not found');
    }

    return this.prisma.deal.create({
      data: {
        boatId: dto.boatId,
        leadId: dto.leadId,
        buyerId: dto.buyerId,
        negotiatedPrice: dto.negotiatedPrice,
        status: dto.status || 'PENDING',
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
        lead: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        buyer: {
          select: { id: true, name: true, avatar: true, email: true },
        },
      },
    });
  }

  async update(id: string, dto: UpdateDealDto, userId: string) {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
      include: { boat: true },
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    const isListingBroker = deal.boat.listingBrokerId === userId;
    const isOwner = deal.boat.ownerId === userId;
    const isBuyer = deal.buyerId === userId;

    if (!isListingBroker && !isOwner && !isBuyer) {
      throw new ForbiddenException(
        'You do not have permission to update this deal'
      );
    }

    return this.prisma.deal.update({
      where: { id },
      data: {
        status: dto.status,
        negotiatedPrice: dto.negotiatedPrice,
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
        lead: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        buyer: {
          select: { id: true, name: true, avatar: true, email: true },
        },
      },
    });
  }
}
