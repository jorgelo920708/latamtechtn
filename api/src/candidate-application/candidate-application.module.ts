import { Module } from '@nestjs/common';
import { CandidateApplicationResolver } from './candidate-application.resolver';
import { CandidateApplicationService } from './candidate-application.service';
import { CandidateApplicationRepository } from './candidate-application.repository';
import { CandidateApplicationFacade } from './candidate-application.facade';
import { PrismaService } from '../prisma.service';
import { StatsModule } from '../stats/stats.module';

@Module({
  imports: [StatsModule],
  providers: [
    CandidateApplicationResolver,
    CandidateApplicationService,
    CandidateApplicationRepository,
    CandidateApplicationFacade,
    PrismaService,
  ],
  exports: [CandidateApplicationFacade],
})
export class CandidateApplicationModule {}
