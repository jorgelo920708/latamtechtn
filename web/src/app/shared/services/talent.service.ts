import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';

export interface TalentLeadInput {
  name: string;
  company: string;
  email: string;
  role: string;
  specialty: string;
  message?: string;
}

export interface CandidateApplicationInput {
  fullName: string;
  email: string;
  location: string;
  specialty: string;
  linkedinUrl?: string;
  englishLevel: string;
  mainStack: string;
  message?: string;
}

const CREATE_TALENT_LEAD = gql`
  mutation CreateTalentLead($input: CreateTalentLeadInput!) {
    createTalentLead(input: $input) {
      id
    }
  }
`;

const CREATE_CANDIDATE_APPLICATION = gql`
  mutation CreateCandidateApplication($input: CreateCandidateApplicationInput!) {
    createCandidateApplication(input: $input) {
      id
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class TalentService {
  private apollo = inject(Apollo);

  createTalentLead(input: TalentLeadInput) {
    return this.apollo
      .mutate<{ createTalentLead: { id: string } }>({
        mutation: CREATE_TALENT_LEAD,
        variables: { input },
      })
      .pipe(map((r) => r.data!.createTalentLead));
  }

  createCandidateApplication(input: CandidateApplicationInput) {
    return this.apollo
      .mutate<{ createCandidateApplication: { id: string } }>({
        mutation: CREATE_CANDIDATE_APPLICATION,
        variables: { input },
      })
      .pipe(map((r) => r.data!.createCandidateApplication));
  }
}
