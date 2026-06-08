import { Injectable } from '@nestjs/common';
import { CandidateApplicationRepository } from './candidate-application.repository';
import { CreateCandidateApplicationInput } from './candidate-application.dto';

@Injectable()
export class CandidateApplicationService {
  constructor(
    private readonly candidateApplicationRepository: CandidateApplicationRepository,
  ) {}

  create(data: CreateCandidateApplicationInput) {
    return this.candidateApplicationRepository.create(data);
  }

  findAll() {
    return this.candidateApplicationRepository.findAll();
  }

  findById(id: string) {
    return this.candidateApplicationRepository.findById(id);
  }
}
