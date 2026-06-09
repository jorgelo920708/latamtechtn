import { Injectable } from '@nestjs/common';
import { CandidateApplicationRepository } from './candidate-application.repository';
import {
  AdminCandidateInput,
  CreateCandidateApplicationInput,
} from './candidate-application.dto';
import { MailService } from '../mail/mail.service';
import { StatsService } from '../stats/stats.service';

@Injectable()
export class CandidateApplicationService {
  constructor(
    private readonly candidateApplicationRepository: CandidateApplicationRepository,
    private readonly mailService: MailService,
    private readonly statsService: StatsService,
  ) {}

  async create(data: CreateCandidateApplicationInput) {
    const application = await this.candidateApplicationRepository.create(data);
    void this.mailService
      .notifyNewCandidateApplication(application)
      .catch(() => undefined);
    void this.statsService.publishChange().catch(() => undefined);
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

  async adminCreate(data: AdminCandidateInput) {
    const application = await this.candidateApplicationRepository.adminCreate(data);
    void this.statsService.publishChange().catch(() => undefined);
    return application;
  }

  update(id: string, data: AdminCandidateInput) {
    return this.candidateApplicationRepository.update(id, data);
  }

  async remove(id: string) {
    const removed = await this.candidateApplicationRepository.remove(id);
    void this.statsService.publishChange().catch(() => undefined);
    return removed;
  }
}
