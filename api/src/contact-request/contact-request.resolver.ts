import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ContactRequestFacade } from './contact-request.facade';
import {
  ContactRequestType,
  CreateContactRequestInput,
} from './contact-request.dto';

@Resolver(() => ContactRequestType)
export class ContactRequestResolver {
  constructor(private readonly contactRequestFacade: ContactRequestFacade) {}

  @Mutation(() => ContactRequestType)
  createContactRequest(@Args('input') input: CreateContactRequestInput) {
    return this.contactRequestFacade.create(input);
  }
}
