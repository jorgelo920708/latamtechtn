import { Injectable } from '@nestjs/common';
import { CandidateApplicationRepository } from './candidate-application.repository';
import { CreateCandidateApplicationInput } from './candidate-application.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class CandidateApplicationService {
  constructor(
    private readonly candidateApplicationRepository: CandidateApplicationRepository,
    private readonly mailService: MailService,
  ) {}

  async create(data: CreateCandidateApplicationInput) {
    const application = await this.candidateApplicationRepository.create(data);
    void this.mailService
      .notifyNewCandidateApplication(application)
      .catch(() => undefined);
    return application;
  }

  findAll() {
    return this.candidateApplicationRepository.findAll();
  }

  findFeatured() {
    return this.candidateApplicationRepository.findFeatured();
  }

  findById(id: string) {
    return this.candidateApplicationRepository.findById(id);
  }
}
