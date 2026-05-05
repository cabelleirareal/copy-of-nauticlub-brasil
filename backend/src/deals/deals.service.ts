import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { DealStatus as PrismaDealStatus } from '@prisma/client';
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
        agreedPrice: dto.negotiatedPrice,
        commissionTotal: (dto.negotiatedPrice * 0.05),
        status: (dto.status || PrismaDealStatus.NEGOTIATING) as PrismaDealStatus,
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

    const updateData: any = {};
    if (dto.status) {
      updateData.status = dto.status;
    }
    if (dto.negotiatedPrice) {
      updateData.agreedPrice = dto.negotiatedPrice;
      updateData.commissionTotal = (dto.negotiatedPrice * 0.05);
    }

    return this.prisma.deal.update({
      where: { id },
      data: updateData,
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
      },
    });
  }
}
