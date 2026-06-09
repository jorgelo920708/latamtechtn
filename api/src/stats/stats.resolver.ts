import { Query, Resolver } from '@nestjs/graphql';
import { StatsFacade } from './stats.facade';
import { PublicStatsType } from './stats.dto';

@Resolver(() => PublicStatsType)
export class StatsResolver {
  constructor(private readonly statsFacade: StatsFacade) {}

  @Query(() => PublicStatsType)
  publicStats() {
    return this.statsFacade.getPublicStats();
  }
}
