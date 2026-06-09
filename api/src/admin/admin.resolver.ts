import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AdminGuard } from '../auth/auth.guard';
import { TalentLeadFacade } from '../talent-lead/talent-lead.facade';
import { CandidateApplicationFacade } from '../candidate-application/candidate-application.facade';
import { ContactRequestFacade } from '../contact-request/contact-request.facade';
import { AdminLeadInput, TalentLeadType } from '../talent-lead/talent-lead.dto';
import {
  AdminCandidateInput,
  CandidateApplicationType,
} from '../candidate-application/candidate-application.dto';
import {
  AdminContactInput,
  ContactRequestType,
} from '../contact-request/contact-request.dto';

@Resolver()
@UseGuards(AdminGuard)
export class AdminResolver {
  constructor(
    private readonly talentLeadFacade: TalentLeadFacade,
    private readonly candidateApplicationFacade: CandidateApplicationFacade,
    private readonly contactRequestFacade: ContactRequestFacade,
  ) {}

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
