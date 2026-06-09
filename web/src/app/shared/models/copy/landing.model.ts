export interface NavCopy {
  forCompanies: string;
  talent: string;
  specialties: string;
  about: string;
  resources: string;
  contact: string;
  cta: string;
  ctaCandidate: string;
}

export interface HeroCopy {
  badge: string;
  titleStart: string;
  titleAccent: string;
  titleEnd: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  checks: string[];
  mapLabel: string;
}

export interface MetricCopy {
  icon: string;
  value: string;
  label: string;
}

export interface SpecialtyFilterCopy {
  key: string;
  label: string;
  icon: string;
}

export interface SpecialtyCategoryCopy {
  icon: string;
  title: string;
  items: string[];
}

export interface SpecialtiesCopy {
  title: string;
  subtitle: string;
  categories: SpecialtyCategoryCopy[];
}

export interface TalentCardCopy {
  code: string;
  topRank: boolean;
  topRankLabel: string;
  role: string;
  location: string;
  english: string;
  stack: string[];
  action: string;
}

export interface TalentCopy {
  title: string;
  filters: SpecialtyFilterCopy[];
  englishLabel: string;
  stackLabel: string;
  categories: Record<string, TalentCardCopy[]>;
}

export interface AboutHighlightCopy {
  icon: string;
  text: string;
}

export interface AboutCopy {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  cta: string;
  highlights: AboutHighlightCopy[];
  photoAlt: string;
}

export interface LogosCopy {
  title: string;
  subtitle: string;
  items: string[];
}

export interface ContactCopy {
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  emailLabel: string;
  linkedinLabel: string;
  copyright: string;
  adminLink: string;
}

export interface FormFieldCopy {
  label: string;
  placeholder: string;
}

export interface SelectFieldCopy extends FormFieldCopy {
  options: string[];
}

export interface SpecialtyGroupCopy {
  label: string;
  items: string[];
}

export interface SpecialtySelectCopy extends FormFieldCopy {
  groups: SpecialtyGroupCopy[];
}

export interface CompanyFormCopy {
  title: string;
  subtitle: string;
  name: FormFieldCopy;
  company: FormFieldCopy;
  email: FormFieldCopy;
  role: FormFieldCopy;
  specialty: SpecialtySelectCopy;
  message: FormFieldCopy;
  submit: string;
}

export interface OptionListCopy {
  label: string;
  options: string[];
}

export interface CvFieldCopy {
  label: string;
  hint: string;
  choose: string;
  change: string;
  uploading: string;
  error: string;
}

export interface YesNoFieldCopy {
  label: string;
  yes: string;
  no: string;
}

export interface CandidateFormCopy {
  title: string;
  subtitle: string;
  fullName: FormFieldCopy;
  email: FormFieldCopy;
  phone: FormFieldCopy;
  location: FormFieldCopy;
  linkedin: FormFieldCopy;
  cv: CvFieldCopy;
  mainRole: SelectFieldCopy;
  otherRoles: OptionListCopy;
  mainStack: OptionListCopy;
  yearsExperience: SelectFieldCopy;
  english: SelectFieldCopy;
  workedInternational: YesNoFieldCopy;
  willingContractor: YesNoFieldCopy;
  jobSearchStatus: SelectFieldCopy;
  desiredSalary: FormFieldCopy;
  minSalary: FormFieldCopy;
  availability: SelectFieldCopy;
  message: FormFieldCopy;
  submit: string;
}

export interface FormCommonCopy {
  close: string;
  submitting: string;
  successTitle: string;
  successBody: string;
  errorBody: string;
  requiredError: string;
  emailError: string;
  sendAnother: string;
  selectPlaceholder: string;
}

export interface FormsCopy {
  common: FormCommonCopy;
  company: CompanyFormCopy;
  candidate: CandidateFormCopy;
}

export interface LandingCopy {
  brandName: string;
  brandTagline: string;
  nav: NavCopy;
  hero: HeroCopy;
  metrics: MetricCopy[];
  specialties: SpecialtiesCopy;
  talent: TalentCopy;
  about: AboutCopy;
  logos: LogosCopy;
  contact: ContactCopy;
  forms: FormsCopy;
}
