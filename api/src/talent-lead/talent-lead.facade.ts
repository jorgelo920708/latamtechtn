import { Injectable } from '@nestjs/common';
import { TalentLeadService } from './talent-lead.service';
import { AdminLeadInput, CreateTalentLeadInput } from './talent-lead.dto';

@Injectable()
export class TalentLeadFacade {
  constructor(private readonly talentLeadService: TalentLeadService) {}

  create(data: CreateTalentLeadInput) {
    return this.talentLeadService.create(data);
  }

  findAll() {
    return this.talentLeadService.findAll();
  }

  findById(id: string) {
    return this.talentLeadService.findById(id);
  }

  adminCreate(data: AdminLeadInput) {
    return this.talentLeadService.adminCreate(data);
  }

  update(id: string, data: AdminLeadInput) {
    return this.talentLeadService.update(id, data);
  }

  remove(id: string) {
    return this.talentLeadService.remove(id);
  }
}
