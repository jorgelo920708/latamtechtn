import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MailTestResultType {
  @Field()
  ok!: boolean;

  @Field()
  detail!: string;

  @Field()
  from!: string;

  @Field()
  to!: string;
}
