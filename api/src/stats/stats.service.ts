import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { StatsRepository } from './stats.repository';
import { PUB_SUB, STATS_CHANGED } from '../realtime/pubsub.module';

@Injectable()
export class StatsService {
  constructor(
    private readonly statsRepository: StatsRepository,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async getPublicStats() {
    const [candidateCount, specialtyCount] = await Promise.all([
      this.statsRepository.countCandidates(),
      this.statsRepository.countDistinctSpecialties(),
    ]);
    return { candidateCount, specialtyCount };
  }

  async buildSnapshot() {
    const [candidateCount, leadCount, contactCount, companyCount, specialtyCount] =
      await Promise.all([
        this.statsRepository.countCandidates(),
        this.statsRepository.countLeads(),
        this.statsRepository.countContacts(),
        this.statsRepository.countCompanies(),
        this.statsRepository.countDistinctSpecialties(),
      ]);
    return { candidateCount, leadCount, contactCount, companyCount, specialtyCount };
  }

  /** Recompute the counts and push them to all subscribed clients. */
  async publishChange(): Promise<void> {
    const snapshot = await this.buildSnapshot();
    await this.pubSub.publish(STATS_CHANGED, { statsChanged: snapshot });
  }
}
