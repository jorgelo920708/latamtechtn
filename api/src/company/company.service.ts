import { Injectable } from '@nestjs/common';
import { CompanyRepository } from './company.repository';
import { AdminCompanyInput } from './company.dto';
import { StatsService } from '../stats/stats.service';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly statsService: StatsService,
  ) {}

  findAll() {
    return this.companyRepository.findAll();
  }

  async create(data: AdminCompanyInput) {
    const company = await this.companyRepository.create(data);
    void this.statsService.publishChange().catch(() => undefined);
    return company;
  }

  update(id: string, data: AdminCompanyInput) {
    return this.companyRepository.update(id, data);
  }

  async remove(id: string) {
    const removed = await this.companyRepository.remove(id);
    void this.statsService.publishChange().catch(() => undefined);
    return removed;
  }
}
