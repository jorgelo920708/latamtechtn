import { Inject } from '@nestjs/common';
import { Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { StatsFacade } from './stats.facade';
import { PublicStatsType, StatsSnapshotType } from './stats.dto';
import { PUB_SUB, STATS_CHANGED } from '../realtime/pubsub.module';

@Resolver(() => PublicStatsType)
export class StatsResolver {
  constructor(
    private readonly statsFacade: StatsFacade,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query(() => PublicStatsType)
  publicStats() {
    return this.statsFacade.getPublicStats();
  }

  @Subscription(() => StatsSnapshotType)
  statsChanged() {
    return this.pubSub.asyncIterableIterator(STATS_CHANGED);
  }
}
