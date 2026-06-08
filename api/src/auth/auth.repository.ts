import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.admin.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.admin.findUnique({ where: { id } });
  }

  create(email: string, passwordHash: string) {
    return this.prisma.admin.create({ data: { email, passwordHash } });
  }

  updatePassword(id: string, passwordHash: string) {
    return this.prisma.admin.update({ where: { id }, data: { passwordHash } });
  }
}
