import { Injectable } from '@nestjs/common';
import { ContactRequestRepository } from './contact-request.repository';
import { CreateContactRequestInput } from './contact-request.dto';

@Injectable()
export class ContactRequestService {
  constructor(
    private readonly contactRequestRepository: ContactRequestRepository,
  ) {}

  create(data: CreateContactRequestInput) {
    return this.contactRequestRepository.create(data);
  }

  findAll() {
    return this.contactRequestRepository.findAll();
  }

  findById(id: string) {
    return this.contactRequestRepository.findById(id);
  }
}
