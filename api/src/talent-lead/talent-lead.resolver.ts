import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TalentLeadFacade } from './talent-lead.facade';
import { CreateTalentLeadInput, TalentLeadType } from './talent-lead.dto';

@Resolver(() => TalentLeadType)
export class TalentLeadResolver {
  constructor(private readonly talentLeadFacade: TalentLeadFacade) {}

  @Mutation(() => TalentLeadType)
  createTalentLead(@Args('input') input: CreateTalentLeadInput) {
    return this.talentLeadFacade.create(input);
  }
}
