import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

@ObjectType()
export class TalentLeadType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  company!: string;

  @Field()
  email!: string;

  @Field()
  role!: string;

  @Field()
  specialty!: string;

  @Field({ nullable: true })
  message?: string;

  @Field()
  status!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@InputType()
export class AdminLeadInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(160)
  company!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(160)
  role!: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(80)
  specialty!: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(2000)
  message?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(40)
  status?: string;
}

@InputType()
export class CreateTalentLeadInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(160)
  company!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(160)
  role!: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(80)
  specialty!: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(2000)
  message?: string;
}
