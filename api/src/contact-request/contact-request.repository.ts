import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  AdminContactInput,
  CreateContactRequestInput,
} from './contact-request.dto';

@Injectable()
export class ContactRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateContactRequestInput) {
    return this.prisma.contactRequest.create({ data });
  }

  adminCreate(data: AdminContactInput) {
    return this.prisma.contactRequest.create({ data });
  }

  update(id: string, data: AdminContactInput) {
    return this.prisma.contactRequest.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.contactRequest.delete({ where: { id } });
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
