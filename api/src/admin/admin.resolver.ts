import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AdminGuard } from '../auth/auth.guard';
import { TalentLeadFacade } from '../talent-lead/talent-lead.facade';
import { CandidateApplicationFacade } from '../candidate-application/candidate-application.facade';
import { ContactRequestFacade } from '../contact-request/contact-request.facade';
import { CompanyFacade } from '../company/company.facade';
import { AdminCompanyInput, CompanyType } from '../company/company.dto';
import { AdminLeadInput, TalentLeadType } from '../talent-lead/talent-lead.dto';
import {
  AdminCandidateInput,
  CandidateApplicationType,
} from '../candidate-application/candidate-application.dto';
import {
  AdminContactInput,
  ContactRequestType,
} from '../contact-request/contact-request.dto';
import { MailService } from '../mail/mail.service';
import { MailTestResultType } from '../mail/mail.dto';

@Resolver()
@UseGuards(AdminGuard)
export class AdminResolver {
  constructor(
    private readonly talentLeadFacade: TalentLeadFacade,
    private readonly candidateApplicationFacade: CandidateApplicationFacade,
    private readonly contactRequestFacade: ContactRequestFacade,
    private readonly companyFacade: CompanyFacade,
    private readonly mailService: MailService,
  ) {}

  @Mutation(() => MailTestResultType)
  sendTestEmail(
    @Args('to', { type: () => String, nullable: true }) to?: string,
  ) {
    return this.mailService.sendTest(to);
  }

  @Query(() => [TalentLeadType])
  talentLeads() {
    return this.talentLeadFacade.findAll();
  }

  @Query(() => [CandidateApplicationType])
  candidateApplications() {
    return this.candidateApplicationFacade.findAll();
  }

  @Query(() => [ContactRequestType])
  contactRequests() {
    return this.contactRequestFacade.findAll();
  }

  @Query(() => [CompanyType])
  companies() {
    return this.companyFacade.findAll();
  }

  @Mutation(() => CompanyType)
  adminCreateCompany(@Args('input') input: AdminCompanyInput) {
    return this.companyFacade.create(input);
  }

  @Mutation(() => CompanyType)
  adminUpdateCompany(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: AdminCompanyInput,
  ) {
    return this.companyFacade.update(id, input);
  }

  @Mutation(() => CompanyType)
  adminDeleteCompany(@Args('id', { type: () => ID }) id: string) {
    return this.companyFacade.remove(id);
  }

  @Mutation(() => TalentLeadType)
  adminCreateTalentLead(@Args('input') input: AdminLeadInput) {
    return this.talentLeadFacade.adminCreate(input);
  }

  @Mutation(() => TalentLeadType)
  adminUpdateTalentLead(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: AdminLeadInput,
  ) {
    return this.talentLeadFacade.update(id, input);
  }

  @Mutation(() => TalentLeadType)
  adminDeleteTalentLead(@Args('id', { type: () => ID }) id: string) {
    return this.talentLeadFacade.remove(id);
  }

  @Mutation(() => CandidateApplicationType)
  adminCreateCandidate(@Args('input') input: AdminCandidateInput) {
    return this.candidateApplicationFacade.adminCreate(input);
  }

  @Mutation(() => CandidateApplicationType)
  adminUpdateCandidate(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: AdminCandidateInput,
  ) {
    return this.candidateApplicationFacade.update(id, input);
  }

  @Mutation(() => CandidateApplicationType)
  adminDeleteCandidate(@Args('id', { type: () => ID }) id: string) {
    return this.candidateApplicationFacade.remove(id);
  }

  @Mutation(() => ContactRequestType)
  adminCreateContact(@Args('input') input: AdminContactInput) {
    return this.contactRequestFacade.adminCreate(input);
  }

  @Mutation(() => ContactRequestType)
  adminUpdateContact(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: AdminContactInput,
  ) {
    return this.contactRequestFacade.update(id, input);
  }

  @Mutation(() => ContactRequestType)
  adminDeleteContact(@Args('id', { type: () => ID }) id: string) {
    return this.contactRequestFacade.remove(id);
  }
}
