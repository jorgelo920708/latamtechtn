import { Injectable } from '@nestjs/common';
import { StatsRepository } from './stats.repository';

@Injectable()
export class StatsService {
  constructor(private readonly statsRepository: StatsRepository) {}

  async getPublicStats() {
    const [candidateCount, specialtyCount] = await Promise.all([
      this.statsRepository.countCandidates(),
      this.statsRepository.countDistinctSpecialties(),
    ]);
    return { candidateCount, specialtyCount };
  }
}
