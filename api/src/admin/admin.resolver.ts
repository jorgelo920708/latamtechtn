import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { AdminGuard } from '../auth/auth.guard';
import { TalentLeadFacade } from '../talent-lead/talent-lead.facade';
import { CandidateApplicationFacade } from '../candidate-application/candidate-application.facade';
import { ContactRequestFacade } from '../contact-request/contact-request.facade';
import { TalentLeadType } from '../talent-lead/talent-lead.dto';
import { CandidateApplicationType } from '../candidate-application/candidate-application.dto';
import { ContactRequestType } from '../contact-request/contact-request.dto';

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
}
