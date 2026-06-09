import { Injectable } from '@nestjs/common';
import { ContactRequestRepository } from './contact-request.repository';
import {
  AdminContactInput,
  CreateContactRequestInput,
} from './contact-request.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactRequestService {
  constructor(
    private readonly contactRequestRepository: ContactRequestRepository,
    private readonly mailService: MailService,
  ) {}

  async create(data: CreateContactRequestInput) {
    const contact = await this.contactRequestRepository.create(data);
    void this.mailService.notifyNewContactRequest(contact).catch(() => undefined);
    return contact;
  }

  findAll() {
    return this.contactRequestRepository.findAll();
  }

  findById(id: string) {
    return this.contactRequestRepository.findById(id);
  }

  adminCreate(data: AdminContactInput) {
    return this.contactRequestRepository.adminCreate(data);
  }

  update(id: string, data: AdminContactInput) {
    return this.contactRequestRepository.update(id, data);
  }

  remove(id: string) {
    return this.contactRequestRepository.remove(id);
  }
}
