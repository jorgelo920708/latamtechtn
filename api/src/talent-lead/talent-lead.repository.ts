import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTalentLeadInput } from './talent-lead.dto';

@Injectable()
export class TalentLeadRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateTalentLeadInput) {
    return this.prisma.talentLead.create({ data });
  }

  findAll() {
    return this.prisma.talentLead.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findById(id: string) {
    return this.prisma.talentLead.findUnique({ where: { id } });
  }
}
