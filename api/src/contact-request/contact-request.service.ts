import { Injectable } from '@nestjs/common';
import { ContactRequestRepository } from './contact-request.repository';
import { CreateContactRequestInput } from './contact-request.dto';
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
}
