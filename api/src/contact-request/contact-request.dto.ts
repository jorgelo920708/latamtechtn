import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

@ObjectType()
export class ContactRequestType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  message!: string;

  @Field()
  status!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@InputType()
export class AdminContactInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(2000)
  message!: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(40)
  status?: string;
}

@InputType()
export class CreateContactRequestInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(2000)
  message!: string;
}
