import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CandidateApplicationFacade } from './candidate-application.facade';
import {
  CandidateApplicationType,
  CreateCandidateApplicationInput,
} from './candidate-application.dto';

@Resolver(() => CandidateApplicationType)
export class CandidateApplicationResolver {
  constructor(
    private readonly candidateApplicationFacade: CandidateApplicationFacade,
  ) {}

  @Mutation(() => CandidateApplicationType)
  createCandidateApplication(
    @Args('input') input: CreateCandidateApplicationInput,
  ) {
    return this.candidateApplicationFacade.create(input);
  }
}
