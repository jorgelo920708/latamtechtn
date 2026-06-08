import { Injectable } from '@nestjs/common';
import { CandidateApplicationService } from './candidate-application.service';
import { CreateCandidateApplicationInput } from './candidate-application.dto';

@Injectable()
export class CandidateApplicationFacade {
  constructor(
    private readonly candidateApplicationService: CandidateApplicationService,
  ) {}

  create(data: CreateCandidateApplicationInput) {
    return this.candidateApplicationService.create(data);
  }

  findAll() {
    return this.candidateApplicationService.findAll();
  }

  findById(id: string) {
    return this.candidateApplicationService.findById(id);
  }
}
