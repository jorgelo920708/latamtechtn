import { Injectable } from '@nestjs/common';
import { TalentLeadRepository } from './talent-lead.repository';
import { AdminLeadInput, CreateTalentLeadInput } from './talent-lead.dto';
import { MailService } from '../mail/mail.service';
import { StatsService } from '../stats/stats.service';

@Injectable()
export class TalentLeadService {
  constructor(
    private readonly talentLeadRepository: TalentLeadRepository,
    private readonly mailService: MailService,
    private readonly statsService: StatsService,
  ) {}

  async create(data: CreateTalentLeadInput) {
    const lead = await this.talentLeadRepository.create(data);
    void this.mailService.notifyNewTalentLead(lead).catch(() => undefined);
    void this.statsService.publishChange().catch(() => undefined);
    return lead;
  }

  findAll() {
    return this.talentLeadRepository.findAll();
  }

  findById(id: string) {
    return this.talentLeadRepository.findById(id);
  }

  async adminCreate(data: AdminLeadInput) {
    const lead = await this.talentLeadRepository.adminCreate(data);
    void this.statsService.publishChange().catch(() => undefined);
    return lead;
  }

  update(id: string, data: AdminLeadInput) {
    return this.talentLeadRepository.update(id, data);
  }

  async remove(id: string) {
    const removed = await this.talentLeadRepository.remove(id);
    void this.statsService.publishChange().catch(() => undefined);
    return removed;
  }
}
