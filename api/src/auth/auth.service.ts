import {
  BadRequestException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthRepository } from './auth.repository';
import { ChangePasswordInput, LoginInput } from './auth.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
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
}
