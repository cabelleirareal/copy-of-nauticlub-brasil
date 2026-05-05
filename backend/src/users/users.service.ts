import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { brokerProfile: true },
    });
    if (!user) throw new NotFoundException('User not found');
    const { password: _p, ...safe } = user;
    return safe;
  }

  async update(id: string, dto: UpdateUserDto) {
    const { brokerProfile, ...userData } = dto;
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...userData,
        ...(brokerProfile
          ? {
              brokerProfile: {
                upsert: { create: brokerProfile, update: brokerProfile },
              },
            }
          : {}),
      },
      include: { brokerProfile: true },
    });
    const { password: _p, ...safe } = updated;
    return safe;
  }
}
