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

  createResetToken(adminId: string, token: string, expiresAt: Date) {
    return this.prisma.passwordResetToken.create({
      data: { adminId, token, expiresAt },
    });
  }

  findResetToken(token: string) {
    return this.prisma.passwordResetToken.findUnique({ where: { token } });
  }

  markResetTokenUsed(id: string) {
    return this.prisma.passwordResetToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }
}
