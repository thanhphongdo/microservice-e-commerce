import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ServiceStatus {
  @Field()
  service: string;

  @Field()
  status: string;
}
