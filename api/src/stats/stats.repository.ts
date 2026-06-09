import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StatsRepository {
  constructor(private readonly prisma: PrismaService) {}

  countCandidates() {
    return this.prisma.candidateApplication.count();
  }

  async countDistinctSpecialties() {
    const rows = await this.prisma.candidateApplication.findMany({
      distinct: ['specialty'],
      select: { specialty: true },
    });
    return rows.length;
  }
}
