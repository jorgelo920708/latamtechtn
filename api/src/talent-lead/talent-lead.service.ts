import { Injectable } from '@nestjs/common';
import { TalentLeadRepository } from './talent-lead.repository';
import { CreateTalentLeadInput } from './talent-lead.dto';

@Injectable()
export class TalentLeadService {
  constructor(private readonly talentLeadRepository: TalentLeadRepository) {}

  create(data: CreateTalentLeadInput) {
    return this.talentLeadRepository.create(data);
  }

  findAll() {
    return this.talentLeadRepository.findAll();
  }

  findById(id: string) {
    return this.talentLeadRepository.findById(id);
  }
}
