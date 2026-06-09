import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyRepository } from './company.repository';
import { CompanyFacade } from './company.facade';
import { PrismaService } from '../prisma.service';
import { StatsModule } from '../stats/stats.module';

@Module({
  imports: [StatsModule],
  providers: [CompanyService, CompanyRepository, CompanyFacade, PrismaService],
  exports: [CompanyFacade],
})
export class CompanyModule {}
