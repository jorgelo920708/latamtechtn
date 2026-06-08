import { Injectable } from '@nestjs/common';
import { TalentLeadRepository } from './talent-lead.repository';
import { CreateTalentLeadInput } from './talent-lead.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class TalentLeadService {
  constructor(
    private readonly talentLeadRepository: TalentLeadRepository,
    private readonly mailService: MailService,
  ) {}

  async create(data: CreateTalentLeadInput) {
    const lead = await this.talentLeadRepository.create(data);
    void this.mailService.notifyNewTalentLead(lead).catch(() => undefined);
    return lead;
  }

  findAll() {
    return this.talentLeadRepository.findAll();
  }

  findById(id: string) {
    return this.talentLeadRepository.findById(id);
  }
}
