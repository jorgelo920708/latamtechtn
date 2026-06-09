import { Injectable } from '@nestjs/common';
import { CompanyRepository } from './company.repository';
import { AdminCompanyInput } from './company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  findAll() {
    return this.companyRepository.findAll();
  }

  create(data: AdminCompanyInput) {
    return this.companyRepository.create(data);
  }

  update(id: string, data: AdminCompanyInput) {
    return this.companyRepository.update(id, data);
  }

  remove(id: string) {
    return this.companyRepository.remove(id);
  }
}
