import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

@ObjectType()
export class CompanyType {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  website?: string;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@InputType()
export class AdminCompanyInput {
  @Field()
  @IsNotEmpty()
  @MaxLength(160)
  name!: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(300)
  website?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(2000)
  notes?: string;
}
