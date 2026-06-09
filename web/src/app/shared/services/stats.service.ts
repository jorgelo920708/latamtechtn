import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';

export interface PublicStats {
  candidateCount: number;
  specialtyCount: number;
}

export interface StatsSnapshot {
  candidateCount: number;
  leadCount: number;
  contactCount: number;
  companyCount: number;
  specialtyCount: number;
}

const PUBLIC_STATS = gql`
  query PublicStats {
    publicStats {
      candidateCount
      specialtyCount
    }
  }
`;

const STATS_CHANGED = gql`
  subscription StatsChanged {
    statsChanged {
      candidateCount
      leadCount
      contactCount
      companyCount
      specialtyCount
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class StatsService {
  private apollo = inject(Apollo);

  getPublicStats() {
    return this.apollo
      .query<{ publicStats: PublicStats }>({
        query: PUBLIC_STATS,
        fetchPolicy: 'network-only',
      })
      .pipe(map((r) => r.data!.publicStats));
  }

  /** Real-time stream of stats, pushed by the server over WebSocket. */
  statsChanged() {
    return this.apollo
      .subscribe<{ statsChanged: StatsSnapshot }>({ query: STATS_CHANGED })
      .pipe(map((r) => r.data?.statsChanged));
  }
}
