import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthFacade } from './auth.facade';
import { AdminGuard } from './auth.guard';
import {
  AdminType,
  AuthPayloadType,
  ChangePasswordInput,
  LoginInput,
} from './auth.dto';

interface AdminContext {
  req: { admin: { sub: string; email: string } };
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authFacade: AuthFacade) {}

  @Mutation(() => AuthPayloadType)
  adminLogin(@Args('input') input: LoginInput) {
    return this.authFacade.login(input);
  }

  @Mutation(() => AdminType)
  @UseGuards(AdminGuard)
  changePassword(
    @Args('input') input: ChangePasswordInput,
    @Context() context: AdminContext,
  ) {
    return this.authFacade.changePassword(context.req.admin.sub, input);
  }

  @Query(() => AdminType)
  @UseGuards(AdminGuard)
  me(@Context() context: AdminContext) {
    return { id: context.req.admin.sub, email: context.req.admin.email };
  }
}
