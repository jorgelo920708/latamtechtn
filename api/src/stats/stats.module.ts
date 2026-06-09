import { Module } from '@nestjs/common';
import { StatsResolver } from './stats.resolver';
import { StatsService } from './stats.service';
import { StatsRepository } from './stats.repository';
import { StatsFacade } from './stats.facade';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [StatsResolver, StatsService, StatsRepository, StatsFacade, PrismaService],
  exports: [StatsFacade],
})
export class StatsModule {}
