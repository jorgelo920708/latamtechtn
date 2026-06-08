import { Injectable, inject, signal } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, tap } from 'rxjs/operators';

const TOKEN_KEY = 'admin_token';
const EMAIL_KEY = 'admin_email';

export interface TalentLead {
  id: string;
  name: string;
  company: string;
  email: string;
  role: string;
  specialty: string;
  message?: string | null;
  status: string;
  createdAt: string;
}

export interface CandidateApplication {
  id: string;
  fullName: string;
  email: string;
  location: string;
  specialty: string;
  linkedinUrl?: string | null;
  englishLevel: string;
  mainStack: string;
  message?: string | null;
  status: string;
  createdAt: string;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
}

const ADMIN_LOGIN = gql`
  mutation AdminLogin($input: LoginInput!) {
    adminLogin(input: $input) {
      token
      email
    }
  }
`;

const CHANGE_PASSWORD = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      id
      email
    }
  }
`;

const TALENT_LEADS = gql`
  query TalentLeads {
    talentLeads {
      id
      name
      company
      email
      role
      specialty
      message
      status
      createdAt
    }
  }
`;

const CANDIDATE_APPLICATIONS = gql`
  query CandidateApplications {
    candidateApplications {
      id
      fullName
      email
      location
      specialty
      linkedinUrl
      englishLevel
      mainStack
      message
      status
      createdAt
    }
  }
`;

const CONTACT_REQUESTS = gql`
  query ContactRequests {
    contactRequests {
      id
      name
      email
      message
      status
      createdAt
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apollo = inject(Apollo);
  email = signal<string | null>(localStorage.getItem(EMAIL_KEY));

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  login(email: string, password: string) {
    return this.apollo
      .mutate<{ adminLogin: { token: string; email: string } }>({
        mutation: ADMIN_LOGIN,
        variables: { input: { email, password } },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        map((r) => r.data!.adminLogin),
        tap((auth) => {
          localStorage.setItem(TOKEN_KEY, auth.token);
          localStorage.setItem(EMAIL_KEY, auth.email);
          this.email.set(auth.email);
        }),
      );
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.apollo
      .mutate<{ changePassword: { id: string } }>({
        mutation: CHANGE_PASSWORD,
        variables: { input: { currentPassword, newPassword } },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((r) => r.data!.changePassword));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    this.email.set(null);
    void this.apollo.client.clearStore();
  }

  getTalentLeads() {
    return this.apollo
      .query<{ talentLeads: TalentLead[] }>({ query: TALENT_LEADS, fetchPolicy: 'network-only' })
      .pipe(map((r) => r.data!.talentLeads));
  }

  getCandidateApplications() {
    return this.apollo
      .query<{ candidateApplications: CandidateApplication[] }>({
        query: CANDIDATE_APPLICATIONS,
        fetchPolicy: 'network-only',
      })
      .pipe(map((r) => r.data!.candidateApplications));
  }

  getContactRequests() {
    return this.apollo
      .query<{ contactRequests: ContactRequest[] }>({
        query: CONTACT_REQUESTS,
        fetchPolicy: 'network-only',
      })
      .pipe(map((r) => r.data!.contactRequests));
  }
}
