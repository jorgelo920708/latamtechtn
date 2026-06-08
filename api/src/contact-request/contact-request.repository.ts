import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateContactRequestInput } from './contact-request.dto';

@Injectable()
export class ContactRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateContactRequestInput) {
    return this.prisma.contactRequest.create({ data });
  }

  findAll() {
    return this.prisma.contactRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.contactRequest.findUnique({ where: { id } });
  }
}
