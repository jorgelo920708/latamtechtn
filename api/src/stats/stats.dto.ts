import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PublicStatsType {
  @Field(() => Int)
  candidateCount!: number;

  @Field(() => Int)
  specialtyCount!: number;
}
