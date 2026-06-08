import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordInput, LoginInput } from './auth.dto';

@Injectable()
export class AuthFacade {
  constructor(private readonly authService: AuthService) {}

  login(input: LoginInput) {
    return this.authService.login(input);
  }

  changePassword(adminId: string, input: ChangePasswordInput) {
    return this.authService.changePassword(adminId, input);
  }
}
