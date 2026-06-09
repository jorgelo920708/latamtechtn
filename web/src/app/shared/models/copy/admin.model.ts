export interface AdminLoginCopy {
  brandSub: string;
  title: string;
  email: string;
  password: string;
  submit: string;
  submitting: string;
  error: string;
  forgot: string;
  backToSite: string;
}

export interface AdminForgotCopy {
  title: string;
  lead: string;
  email: string;
  submit: string;
  submitting: string;
  sentTitle: string;
  sentBody: string;
  backToLogin: string;
}

export interface AdminResetCopy {
  title: string;
  lead: string;
  password: string;
  hint: string;
  submit: string;
  submitting: string;
  error: string;
  doneTitle: string;
  doneBody: string;
  doneCta: string;
  invalidTitle: string;
  invalidBody: string;
  invalidCta: string;
  backToLogin: string;
}

export interface AdminRecordsCopy {
  email: string;
  phone: string;
  role: string;
  mainRole: string;
  otherRoles: string;
  experience: string;
  english: string;
  stack: string;
  international: string;
  contractor: string;
  jobSearch: string;
  desiredSalary: string;
  minSalary: string;
  availability: string;
  linkedin: string;
  cv: string;
  viewCv: string;
  message: string;
  specialty: string;
}

export interface AdminDashboardCopy {
  brandSub: string;
  role: string;
  logout: string;
  loading: string;
  loadError: string;
  retry: string;
  noResults: string;
  navOverview: string;
  navLeads: string;
  navCandidates: string;
  navContacts: string;
  navAccount: string;
  titleOverview: string;
  titleLeads: string;
  titleCandidates: string;
  titleContacts: string;
  titleAccount: string;
  greeting: string;
  intro: string;
  statLeads: string;
  statCandidates: string;
  statContacts: string;
  statTotal: string;
  recentTitle: string;
  noActivity: string;
  kindLead: string;
  kindCandidate: string;
  kindContact: string;
  searchLeads: string;
  searchCandidates: string;
  searchContacts: string;
  emptyLeads: string;
  emptyCandidates: string;
  emptyContacts: string;
  accountTitle: string;
  currentPassword: string;
  newPassword: string;
  passwordHint: string;
  save: string;
  saving: string;
  saved: string;
  errorCurrent: string;
  errorGeneric: string;
  yes: string;
  no: string;
  records: AdminRecordsCopy;
}

export interface AdminCopy {
  login: AdminLoginCopy;
  forgot: AdminForgotCopy;
  reset: AdminResetCopy;
  dashboard: AdminDashboardCopy;
}
