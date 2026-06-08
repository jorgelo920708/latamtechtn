import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@ObjectType()
export class AdminType {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;
}

@ObjectType()
export class AuthPayloadType {
  @Field()
  token!: string;

  @Field()
  email!: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsNotEmpty()
  password!: string;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  @IsNotEmpty()
  currentPassword!: string;

  @Field()
  @MinLength(8)
  newPassword!: string;
}

@ObjectType()
export class StatusType {
  @Field()
  success!: boolean;
}

@InputType()
export class RequestPasswordResetInput {
  @Field()
  @IsEmail()
  email!: string;
}

@InputType()
export class ResetPasswordInput {
  @Field()
  @IsNotEmpty()
  token!: string;

  @Field()
  @MinLength(8)
  newPassword!: string;
}
