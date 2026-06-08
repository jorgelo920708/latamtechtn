import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  MaxLength,
} from 'class-validator';

@ObjectType()
export class CandidateApplicationType {
  @Field(() => ID)
  id!: string;

  @Field()
  fullName!: string;

  @Field()
  email!: string;

  @Field()
  location!: string;

  @Field()
  specialty!: string;

  @Field({ nullable: true })
  linkedinUrl?: string;

  @Field()
  englishLevel!: string;

  @Field()
  mainStack!: string;

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
export class CreateCandidateApplicationInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(120)
  fullName!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(120)
  location!: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(80)
  specialty!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  @MaxLength(300)
  linkedinUrl?: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(20)
  englishLevel!: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(300)
  mainStack!: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(2000)
  message?: string;
}
