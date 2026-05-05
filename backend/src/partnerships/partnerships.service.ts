import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PartnershipsService {
  constructor(private prisma: PrismaService) {}

  async list(userId: string) {
    return this.prisma.partnership.findMany({
      where: { partnerBrokerId: userId },
    });
  }
}
