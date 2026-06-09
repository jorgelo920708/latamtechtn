import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

// Maps a (possibly messy, multi-value) mainRole string to one of the catalog
// specialty categories. Keyword-based so it tolerates free-form answers like
// "Full Stack, Frontend, AI Engineer". Returns null when nothing matches.
function categorizeRole(role: string): string | null {
  const r = role.toLowerCase();
  if (/salesforce/.test(r)) return 'salesforce';
  if (/\bqa\b|quality|sdet|tester|testing|automation/.test(r)) return 'qa';
  if (/security|ciberseg|seguridad|infosec|pentest/.test(r)) return 'security';
  if (/devops|sre|site reliability|cloud|infra|platform engineer|kubernetes/.test(r)) return 'cloud';
  if (/data|machine learning|\bml\b|\bai\b|analytic|scientist|power bi|cientific|analista de datos/.test(r))
    return 'data';
  if (/product manager|product owner|\bscrum\b|project manager|\bpm\b|\bpo\b|agile|delivery/.test(r))
    return 'product';
  if (/marketing|growth|\bseo\b|content|community/.test(r)) return 'marketing';
  if (/\bsales\b|ventas|account exec|business development|comercial/.test(r)) return 'sales';
  if (/finance|finanzas|accounting|contad|contab/.test(r)) return 'finance';
  if (/recruit|talent acquisition|rrhh|human resources|recursos humanos|people ops/.test(r))
    return 'hr';
  if (
    /engineer|developer|software|backend|frontend|full ?stack|mobile|react|angular|node|python|java|\.net|ruby|rails|php|web|programad|desarrollad|architect/.test(
      r,
    )
  )
    return 'software';
  return null;
}

@Injectable()
export class StatsRepository {
  constructor(private readonly prisma: PrismaService) {}

  countCandidates() {
    return this.prisma.candidateApplication.count();
  }

  countLeads() {
    return this.prisma.talentLead.count();
  }

  countContacts() {
    return this.prisma.contactRequest.count();
  }

  // Number of distinct specialty categories represented across registered
  // candidates (derived from each candidate's mainRole).
  async countDistinctSpecialties() {
    const rows = await this.prisma.candidateApplication.findMany({
      where: { mainRole: { not: null } },
      select: { mainRole: true },
    });
    const categories = new Set<string>();
    for (const row of rows) {
      const category = categorizeRole(row.mainRole ?? '');
      if (category) categories.add(category);
    }
    return categories.size;
  }
}
