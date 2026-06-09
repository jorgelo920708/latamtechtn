import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CandidateApplicationFacade } from './candidate-application.facade';
import {
  CandidateApplicationType,
  CreateCandidateApplicationInput,
  FeaturedCandidateType,
} from './candidate-application.dto';

@Resolver(() => CandidateApplicationType)
export class CandidateApplicationResolver {
  constructor(
    private readonly candidateApplicationFacade: CandidateApplicationFacade,
  ) {}

  @Query(() => [FeaturedCandidateType])
  featuredCandidates() {
    return this.candidateApplicationFacade.findFeatured();
  }

  @Mutation(() => CandidateApplicationType)
  createCandidateApplication(
    @Args('input') input: CreateCandidateApplicationInput,
  ) {
    return this.candidateApplicationFacade.create(input);
  }
}
