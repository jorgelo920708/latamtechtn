import {
  BadRequestException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { AuthRepository } from './auth.repository';
import { ChangePasswordInput, LoginInput } from './auth.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.ensureSeedAdmin();
  }

  private async ensureSeedAdmin(): Promise<void> {
    const email = (
      process.env.ADMIN_EMAIL ?? 'elbacaseres83@gmail.com'
    ).toLowerCase();
    const existing = await this.authRepository.findByEmail(email);
    if (existing) return;
    const password = process.env.ADMIN_INITIAL_PASSWORD ?? 'LatamTalent2026!';
    const passwordHash = await bcrypt.hash(password, 10);
    await this.authRepository.create(email, passwordHash);
  }

  async login(input: LoginInput) {
    const email = input.email.toLowerCase();
    const admin = await this.authRepository.findByEmail(email);
    if (!admin) throw new UnauthorizedException('Credenciales inválidas');

    const valid = await bcrypt.compare(input.password, admin.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    const token = await this.jwtService.signAsync({
      sub: admin.id,
      email: admin.email,
    });
    return { token, email: admin.email };
  }

  async changePassword(adminId: string, input: ChangePasswordInput) {
    const admin = await this.authRepository.findById(adminId);
    if (!admin) throw new UnauthorizedException();

    const valid = await bcrypt.compare(
      input.currentPassword,
      admin.passwordHash,
    );
    if (!valid)
      throw new BadRequestException('La contraseña actual es incorrecta');

    const passwordHash = await bcrypt.hash(input.newPassword, 10);
    await this.authRepository.updatePassword(admin.id, passwordHash);
    return { id: admin.id, email: admin.email };
  }

  async requestPasswordReset(email: string) {
    const admin = await this.authRepository.findByEmail(email.toLowerCase());
    if (admin) {
      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      await this.authRepository.createResetToken(admin.id, token, expiresAt);
      const resetUrl = `${this.webUrl()}/admin/reset?token=${token}`;
      void this.mailService
        .sendPasswordReset(admin.email, resetUrl)
        .catch(() => undefined);
    }
    return { success: true };
  }

  async resetPassword(token: string, newPassword: string) {
    const record = await this.authRepository.findResetToken(token);
    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw new BadRequestException('El enlace es inválido o expiró');
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.authRepository.updatePassword(record.adminId, passwordHash);
    await this.authRepository.markResetTokenUsed(record.id);
    return { success: true };
  }

  private webUrl(): string {
    return process.env.WEB_URL ?? 'https://www.latamtechtn.com';
  }
}
