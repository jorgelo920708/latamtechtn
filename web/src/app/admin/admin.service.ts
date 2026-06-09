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
  phone?: string | null;
  location: string;
  city?: string | null;
  linkedinUrl?: string | null;
  cvUrl?: string | null;
  mainRole: string;
  otherRoles?: string | null;
  mainStack?: string | null;
  yearsExperience: string;
  englishLevel: string;
  workedInternational: boolean;
  willingContractor?: boolean | null;
  jobSearchStatus?: string | null;
  desiredSalary?: number | null;
  minSalary?: number | null;
  availability?: string | null;
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

export interface AdminLeadInput {
  name: string;
  company: string;
  email: string;
  role: string;
  specialty: string;
  message?: string;
  status?: string;
}

export interface AdminCandidateInput {
  fullName: string;
  email: string;
  location: string;
  city?: string;
  englishLevel: string;
  phone?: string;
  linkedinUrl?: string;
  cvUrl?: string;
  mainRole?: string;
  otherRoles?: string;
  mainStack?: string;
  yearsExperience?: string;
  workedInternational?: boolean;
  willingContractor?: boolean;
  jobSearchStatus?: string;
  desiredSalary?: number;
  minSalary?: number;
  availability?: string;
  message?: string;
  status?: string;
}

export interface AdminContactInput {
  name: string;
  email: string;
  message: string;
  status?: string;
}

export interface Company {
  id: string;
  name: string;
  website?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface AdminCompanyInput {
  name: string;
  website?: string;
  notes?: string;
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
      phone
      location
      city
      linkedinUrl
      cvUrl
      mainRole
      otherRoles
      mainStack
      yearsExperience
      englishLevel
      workedInternational
      willingContractor
      jobSearchStatus
      desiredSalary
      minSalary
      availability
      message
      status
      createdAt
    }
  }
`;

const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($input: RequestPasswordResetInput!) {
    requestPasswordReset(input: $input) {
      success
    }
  }
`;

const RESET_PASSWORD = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      success
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

const ADMIN_CREATE_LEAD = gql`
  mutation AdminCreateLead($input: AdminLeadInput!) {
    adminCreateTalentLead(input: $input) { id }
  }
`;
const ADMIN_UPDATE_LEAD = gql`
  mutation AdminUpdateLead($id: ID!, $input: AdminLeadInput!) {
    adminUpdateTalentLead(id: $id, input: $input) { id }
  }
`;
const ADMIN_DELETE_LEAD = gql`
  mutation AdminDeleteLead($id: ID!) {
    adminDeleteTalentLead(id: $id) { id }
  }
`;
const ADMIN_CREATE_CANDIDATE = gql`
  mutation AdminCreateCandidate($input: AdminCandidateInput!) {
    adminCreateCandidate(input: $input) { id }
  }
`;
const ADMIN_UPDATE_CANDIDATE = gql`
  mutation AdminUpdateCandidate($id: ID!, $input: AdminCandidateInput!) {
    adminUpdateCandidate(id: $id, input: $input) { id }
  }
`;
const ADMIN_DELETE_CANDIDATE = gql`
  mutation AdminDeleteCandidate($id: ID!) {
    adminDeleteCandidate(id: $id) { id }
  }
`;
const COMPANIES = gql`
  query Companies {
    companies { id name website notes createdAt }
  }
`;
const ADMIN_CREATE_COMPANY = gql`
  mutation AdminCreateCompany($input: AdminCompanyInput!) {
    adminCreateCompany(input: $input) { id }
  }
`;
const ADMIN_UPDATE_COMPANY = gql`
  mutation AdminUpdateCompany($id: ID!, $input: AdminCompanyInput!) {
    adminUpdateCompany(id: $id, input: $input) { id }
  }
`;
const ADMIN_DELETE_COMPANY = gql`
  mutation AdminDeleteCompany($id: ID!) {
    adminDeleteCompany(id: $id) { id }
  }
`;

const ADMIN_CREATE_CONTACT = gql`
  mutation AdminCreateContact($input: AdminContactInput!) {
    adminCreateContact(input: $input) { id }
  }
`;
const ADMIN_UPDATE_CONTACT = gql`
  mutation AdminUpdateContact($id: ID!, $input: AdminContactInput!) {
    adminUpdateContact(id: $id, input: $input) { id }
  }
`;
const ADMIN_DELETE_CONTACT = gql`
  mutation AdminDeleteContact($id: ID!) {
    adminDeleteContact(id: $id) { id }
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

  requestPasswordReset(email: string) {
    return this.apollo
      .mutate<{ requestPasswordReset: { success: boolean } }>({
        mutation: REQUEST_PASSWORD_RESET,
        variables: { input: { email } },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((r) => r.data!.requestPasswordReset));
  }

  resetPassword(token: string, newPassword: string) {
    return this.apollo
      .mutate<{ resetPassword: { success: boolean } }>({
        mutation: RESET_PASSWORD,
        variables: { input: { token, newPassword } },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((r) => r.data!.resetPassword));
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

  private run(mutation: typeof ADMIN_CREATE_LEAD, variables: Record<string, unknown>) {
    return this.apollo
      .mutate({ mutation, variables, fetchPolicy: 'no-cache' })
      .pipe(map((r) => r.data));
  }

  createLead(input: AdminLeadInput) {
    return this.run(ADMIN_CREATE_LEAD, { input });
  }
  updateLead(id: string, input: AdminLeadInput) {
    return this.run(ADMIN_UPDATE_LEAD, { id, input });
  }
  deleteLead(id: string) {
    return this.run(ADMIN_DELETE_LEAD, { id });
  }

  createCandidate(input: AdminCandidateInput) {
    return this.run(ADMIN_CREATE_CANDIDATE, { input });
  }
  updateCandidate(id: string, input: AdminCandidateInput) {
    return this.run(ADMIN_UPDATE_CANDIDATE, { id, input });
  }
  deleteCandidate(id: string) {
    return this.run(ADMIN_DELETE_CANDIDATE, { id });
  }

  createContact(input: AdminContactInput) {
    return this.run(ADMIN_CREATE_CONTACT, { input });
  }
  updateContact(id: string, input: AdminContactInput) {
    return this.run(ADMIN_UPDATE_CONTACT, { id, input });
  }
  deleteContact(id: string) {
    return this.run(ADMIN_DELETE_CONTACT, { id });
  }

  getCompanies() {
    return this.apollo
      .query<{ companies: Company[] }>({ query: COMPANIES, fetchPolicy: 'network-only' })
      .pipe(map((r) => r.data!.companies));
  }
  createCompany(input: AdminCompanyInput) {
    return this.run(ADMIN_CREATE_COMPANY, { input });
  }
  updateCompany(id: string, input: AdminCompanyInput) {
    return this.run(ADMIN_UPDATE_COMPANY, { id, input });
  }
  deleteCompany(id: string) {
    return this.run(ADMIN_DELETE_COMPANY, { id });
  }
}
