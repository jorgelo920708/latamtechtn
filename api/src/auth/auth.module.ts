import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { AuthFacade } from './auth.facade';
import { AdminGuard } from './auth.guard';
import { AdminResolver } from '../admin/admin.resolver';
import { PrismaService } from '../prisma.service';
import { TalentLeadModule } from '../talent-lead/talent-lead.module';
import { CandidateApplicationModule } from '../candidate-application/candidate-application.module';
import { ContactRequestModule } from '../contact-request/contact-request.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET ?? 'dev-insecure-secret-change-me',
        signOptions: { expiresIn: '7d' },
      }),
    }),
    TalentLeadModule,
    CandidateApplicationModule,
    ContactRequestModule,
    CompanyModule,
  ],
  providers: [
    AuthResolver,
    AuthService,
    AuthRepository,
    AuthFacade,
    AdminGuard,
    AdminResolver,
    PrismaService,
  ],
})
export class AuthModule {}
