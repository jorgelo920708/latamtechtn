import { Injectable } from '@nestjs/common';
import { ContactRequestRepository } from './contact-request.repository';
import {
  AdminContactInput,
  CreateContactRequestInput,
} from './contact-request.dto';
import { MailService } from '../mail/mail.service';
import { StatsService } from '../stats/stats.service';

@Injectable()
export class ContactRequestService {
  constructor(
    private readonly contactRequestRepository: ContactRequestRepository,
    private readonly mailService: MailService,
    private readonly statsService: StatsService,
  ) {}

  async create(data: CreateContactRequestInput) {
    const contact = await this.contactRequestRepository.create(data);
    void this.mailService.notifyNewContactRequest(contact).catch(() => undefined);
    void this.statsService.publishChange().catch(() => undefined);
    return contact;
  }

  findAll() {
    return this.contactRequestRepository.findAll();
  }

  findById(id: string) {
    return this.contactRequestRepository.findById(id);
  }

  async adminCreate(data: AdminContactInput) {
    const contact = await this.contactRequestRepository.adminCreate(data);
    void this.statsService.publishChange().catch(() => undefined);
    return contact;
  }

  update(id: string, data: AdminContactInput) {
    return this.contactRequestRepository.update(id, data);
  }

  async remove(id: string) {
    const removed = await this.contactRequestRepository.remove(id);
    void this.statsService.publishChange().catch(() => undefined);
    return removed;
  }
}
