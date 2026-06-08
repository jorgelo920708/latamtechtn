import { Injectable } from '@nestjs/common';
import { ContactRequestService } from './contact-request.service';
import { CreateContactRequestInput } from './contact-request.dto';

@Injectable()
export class ContactRequestFacade {
  constructor(private readonly contactRequestService: ContactRequestService) {}

  create(data: CreateContactRequestInput) {
    return this.contactRequestService.create(data);
  }

  findAll() {
    return this.contactRequestService.findAll();
  }

  findById(id: string) {
    return this.contactRequestService.findById(id);
  }
}
