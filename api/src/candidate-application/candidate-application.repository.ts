import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCandidateApplicationInput } from './candidate-application.dto';

@Injectable()
export class CandidateApplicationRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateCandidateApplicationInput) {
    return this.prisma.candidateApplication.create({ data });
  }

  findAll() {
    return this.prisma.candidateApplication.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findFeatured() {
    return this.prisma.candidateApplication.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        mainRole: true,
        location: true,
        englishLevel: true,
        mainStack: true,
        yearsExperience: true,
      },
    });
  }

  findById(id: string) {
    return this.prisma.candidateApplication.findUnique({ where: { id } });
  }
}
