import { Injectable } from '@nestjs/common';
import { CompanyService } from './company.service';
import { AdminCompanyInput } from './company.dto';

@Injectable()
export class CompanyFacade {
  constructor(private readonly companyService: CompanyService) {}

  findAll() {
    return this.companyService.findAll();
  }

  create(data: AdminCompanyInput) {
    return this.companyService.create(data);
  }

  update(id: string, data: AdminCompanyInput) {
    return this.companyService.update(id, data);
  }

  remove(id: string) {
    return this.companyService.remove(id);
  }
}
