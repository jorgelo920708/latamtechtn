import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AdminCompanyInput } from './company.dto';

@Injectable()
export class CompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.company.findMany({ orderBy: { name: 'asc' } });
  }

  create(data: AdminCompanyInput) {
    return this.prisma.company.create({ data });
  }

  update(id: string, data: AdminCompanyInput) {
    return this.prisma.company.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.company.delete({ where: { id } });
  }
}
