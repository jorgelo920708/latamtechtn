import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PublicStatsType {
  @Field(() => Int)
  candidateCount!: number;

  @Field(() => Int)
  specialtyCount!: number;
}

@ObjectType()
export class StatsSnapshotType {
  @Field(() => Int)
  candidateCount!: number;

  @Field(() => Int)
  leadCount!: number;

  @Field(() => Int)
  contactCount!: number;

  @Field(() => Int)
  companyCount!: number;

  @Field(() => Int)
  specialtyCount!: number;
}
