import { faker } from '@faker-js/faker';
import { BadRequestException, Injectable } from '@nestjs/common';
import { customAlphabet, urlAlphabet } from 'nanoid';
import {
  EmailDeleteDto,
  EmailDto,
  EmailMarkReadDto,
  EmailsFindDto,
} from './dtos';

const newId = customAlphabet(urlAlphabet, 8);

@Injectable()
export class AppService {
  database: Partial<EmailDto>[] = [];

  constructor() {
    // add some dummy data using faker library
    // 10 inbox items (3 unread and 7 read)
    for (let i = 0; i < 10; i++) {
      this.database.push({
        id: newId(),
        to: [faker.internet.email()],
        from: faker.internet.email(),
        subject: faker.lorem.sentence(4),
        content: faker.lorem.paragraphs(),
        location: 'inbox',
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        receivedAt: faker.date.past(),
        sentAt: faker.date.past(),
        readAt: i < 3 ? undefined : faker.date.past(),
      });
    }

    // 5 sent itmes
    for (let i = 0; i < 5; i++) {
      this.database.push({
        id: newId(),
        to: [faker.internet.email()],
        from: faker.internet.email(),
        subject: faker.lorem.sentence(4),
        content: faker.lorem.paragraphs(),
        location: 'sent',
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        sentAt: faker.date.past(),
      });
    }

    // 3 trash items
    for (let i = 0; i < 3; i++) {
      this.database.push({
        id: newId(),
        to: [faker.internet.email()],
        from: faker.internet.email(),
        subject: faker.lorem.sentence(4),
        content: faker.lorem.paragraphs(),
        location: 'trash',
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
        sentAt: faker.date.past(),
      });
    }

    // 2 drafts
    for (let i = 0; i < 2; i++) {
      this.database.push({
        id: newId(),
        to: [faker.internet.email()],
        from: faker.internet.email(),
        subject: faker.lorem.sentence(4),
        content: faker.lorem.paragraphs(),
        location: 'draft',
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      });
    }
  }

  find(payload: EmailsFindDto) {
    return this.database
      .filter((email) => {
        return (
          (email.location === payload.location || !payload.location) &&
          (email.cc?.some((t) => t.includes(payload.query)) ||
            email.bcc?.some((t) => t.includes(payload.query)) ||
            email.to?.some((t) => t.includes(payload.query)) ||
            email.from?.includes(payload.query) ||
            email.subject?.includes(payload.query) ||
            email.content?.includes(payload.query) ||
            !payload.query)
        );
      })
      .sort((a, b) => {
        if (!payload.sortBy) {
          return 0;
        }
        if (payload.sortDirection === 'asc') {
          return a[payload.sortBy] > b[payload.sortBy] ? 1 : -1;
        } else {
          return a[payload.sortBy] < b[payload.sortBy] ? 1 : -1;
        }
      })
      .splice(payload.skip ?? 0, payload.take ?? 25);
  }

  findOne(id: string) {
    return this.database.find((e) => e.id === id);
  }

  save(payload: Partial<EmailDto>) {
    const email = this.database.find((e) => e.id === payload.id);

    if (email && email.location !== 'draft') {
      throw new BadRequestException('Email is not a draft');
    }

    if (email) {
      this.update(payload.id, payload);
    } else {
      this.add(payload);
    }
  }

  delete(payload: EmailDeleteDto) {
    if (!(payload.ids?.length > 0)) {
      throw new BadRequestException('Email id is required');
    }

    this.database = this.database.filter((e) => !payload.ids.includes(e.id));

    return true;
  }

  send(payload: EmailDto) {
    const email = this.database.find((e) => e.id === payload.id);

    if (!email) {
      this.add(payload);
    }

    email.location = 'sent';
    email.sentAt = new Date();
  }

  markRead(payload: EmailMarkReadDto) {
    const emails = this.database.filter((e) => payload.ids.includes(e.id));

    emails.forEach((e) => (e.readAt = payload.read ? new Date() : null));
  }

  private add(payload: Partial<EmailDto>) {
    this.database.push({
      ...payload,
      id: newId(),
      location: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      sentAt: null,
      readAt: null,
    });
  }

  private update(id: string, payload: Partial<EmailDto>) {
    const email = this.database.find((e) => e.id === id);

    if (email) {
      Object.assign(email, payload, { updatedAt: new Date() });
    }
  }
}
