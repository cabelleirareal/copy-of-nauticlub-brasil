import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  async list(userId: string) {
    return this.prisma.deal.findMany({
      where: { OR: [{ boat: { listingBrokerId: userId } }] },
    });
  }
}
