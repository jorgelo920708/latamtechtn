import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AdminLeadInput, CreateTalentLeadInput } from './talent-lead.dto';

@Injectable()
export class TalentLeadRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateTalentLeadInput) {
    return this.prisma.talentLead.create({ data });
  }

  adminCreate(data: AdminLeadInput) {
    return this.prisma.talentLead.create({ data });
  }

  update(id: string, data: AdminLeadInput) {
    return this.prisma.talentLead.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.talentLead.delete({ where: { id } });
  }

  findAll() {
    return this.prisma.talentLead.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findById(id: string) {
    return this.prisma.talentLead.findUnique({ where: { id } });
  }
}
