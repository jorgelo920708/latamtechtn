import { Module } from '@nestjs/common';
import { TalentLeadResolver } from './talent-lead.resolver';
import { TalentLeadService } from './talent-lead.service';
import { TalentLeadRepository } from './talent-lead.repository';
import { TalentLeadFacade } from './talent-lead.facade';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [
    TalentLeadResolver,
    TalentLeadService,
    TalentLeadRepository,
    TalentLeadFacade,
    PrismaService,
  ],
  exports: [TalentLeadFacade],
})
export class TalentLeadModule {}
