import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';

export interface PublicStats {
  candidateCount: number;
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
}
