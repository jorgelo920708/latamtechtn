import { Module } from '@nestjs/common';
import { ContactRequestResolver } from './contact-request.resolver';
import { ContactRequestService } from './contact-request.service';
import { ContactRequestRepository } from './contact-request.repository';
import { ContactRequestFacade } from './contact-request.facade';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [
    ContactRequestResolver,
    ContactRequestService,
    ContactRequestRepository,
    ContactRequestFacade,
    PrismaService,
  ],
  exports: [ContactRequestFacade],
})
export class ContactRequestModule {}
