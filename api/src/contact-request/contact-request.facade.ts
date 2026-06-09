import { Injectable } from '@nestjs/common';
import { ContactRequestService } from './contact-request.service';
import {
  AdminContactInput,
  CreateContactRequestInput,
} from './contact-request.dto';

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

  adminCreate(data: AdminContactInput) {
    return this.contactRequestService.adminCreate(data);
  }

  update(id: string, data: AdminContactInput) {
    return this.contactRequestService.update(id, data);
  }

  remove(id: string) {
    return this.contactRequestService.remove(id);
  }
}
