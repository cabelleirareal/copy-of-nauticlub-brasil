import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BoatsModule } from './boats/boats.module';
import { LeadsModule } from './leads/leads.module';
import { PartnershipsModule } from './partnerships/partnerships.module';
import { DealsModule } from './deals/deals.module';
import { HealthController } from './common/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    BoatsModule,
    LeadsModule,
    PartnershipsModule,
    DealsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
