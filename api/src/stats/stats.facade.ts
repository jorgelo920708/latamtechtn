import { Injectable } from '@nestjs/common';
import { StatsService } from './stats.service';

@Injectable()
export class StatsFacade {
  constructor(private readonly statsService: StatsService) {}

  getPublicStats() {
    return this.statsService.getPublicStats();
  }
}
