import { Injectable } from '@nestjs/common';
import { CandidateApplicationService } from './candidate-application.service';
import {
  AdminCandidateInput,
  CreateCandidateApplicationInput,
} from './candidate-application.dto';

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

  findFeatured() {
    return this.candidateApplicationService.findFeatured();
  }

  findById(id: string) {
    return this.candidateApplicationService.findById(id);
  }

  adminCreate(data: AdminCandidateInput) {
    return this.candidateApplicationService.adminCreate(data);
  }

  update(id: string, data: AdminCandidateInput) {
    return this.candidateApplicationService.update(id, data);
  }

  remove(id: string) {
    return this.candidateApplicationService.remove(id);
  }
}
