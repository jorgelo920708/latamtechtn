import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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
  phone?: string;
  location: string;
  linkedinUrl: string;
  cvUrl: string;
  mainRole: string;
  otherRoles?: string;
  mainStack?: string;
  yearsExperience: string;
  englishLevel: string;
  workedInternational: boolean;
  willingContractor?: boolean;
  jobSearchStatus?: string;
  desiredSalary: number;
  minSalary?: number;
  availability?: string;
  message?: string;
}

export interface FeaturedCandidate {
  id: string;
  mainRole: string;
  location: string;
  englishLevel: string;
  mainStack?: string | null;
  yearsExperience: string;
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

const FEATURED_CANDIDATES = gql`
  query FeaturedCandidates {
    featuredCandidates {
      id
      mainRole
      location
      englishLevel
      mainStack
      yearsExperience
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class TalentService {
  private apollo = inject(Apollo);

  private get apiBase(): string {
    return environment.apiUrl.replace(/\/graphql\/?$/, '');
  }

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

  getFeaturedCandidates() {
    return this.apollo
      .query<{ featuredCandidates: FeaturedCandidate[] }>({
        query: FEATURED_CANDIDATES,
        fetchPolicy: 'network-only',
      })
      .pipe(map((r) => r.data!.featuredCandidates));
  }

  async uploadCv(file: File): Promise<string> {
    const response = await fetch(`${this.apiBase}/cv`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/pdf',
        'X-Filename': encodeURIComponent(file.name),
      },
      body: file,
    });
    if (!response.ok) {
      throw new Error('upload-failed');
    }
    const data = (await response.json()) as { url: string };
    return `${this.apiBase}${data.url}`;
  }
}
