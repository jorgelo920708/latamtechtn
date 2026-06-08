import { Injectable } from '@nestjs/common';
import { TalentLeadService } from './talent-lead.service';
import { CreateTalentLeadInput } from './talent-lead.dto';

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
}
