import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

@ObjectType()
export class CandidateApplicationType {
  @Field(() => ID)
  id!: string;

  @Field()
  fullName!: string;

  @Field()
  email!: string;

  @Field({ nullable: true })
  phone?: string;

  @Field()
  location!: string;

  @Field()
  linkedinUrl!: string;

  @Field({ nullable: true })
  cvUrl?: string;

  @Field()
  mainRole!: string;

  @Field({ nullable: true })
  otherRoles?: string;

  @Field({ nullable: true })
  mainStack?: string;

  @Field()
  yearsExperience!: string;

  @Field()
  englishLevel!: string;

  @Field()
  workedInternational!: boolean;

  @Field(() => Int, { nullable: true })
  desiredSalary?: number;

  @Field(() => Int, { nullable: true })
  minSalary?: number;

  @Field({ nullable: true })
  availability?: string;

  @Field({ nullable: true })
  message?: string;

  @Field()
  status!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
export class FeaturedCandidateType {
  @Field(() => ID)
  id!: string;

  @Field()
  mainRole!: string;

  @Field()
  location!: string;

  @Field()
  englishLevel!: string;

  @Field({ nullable: true })
  mainStack?: string;

  @Field()
  yearsExperience!: string;
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

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(40)
  phone?: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(160)
  location!: string;

  @Field()
  @IsUrl()
  @MaxLength(300)
  linkedinUrl!: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(500)
  cvUrl!: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(120)
  mainRole!: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(500)
  otherRoles?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(300)
  mainStack?: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(20)
  yearsExperience!: string;

  @Field()
  @IsNotEmpty()
  @MaxLength(40)
  englishLevel!: string;

  @Field()
  @IsBoolean()
  workedInternational!: boolean;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  desiredSalary!: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  minSalary?: number;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(60)
  availability?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(2000)
  message?: string;
}
