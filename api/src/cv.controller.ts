import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { PrismaService } from './prisma.service';

const MAX_BYTES = 10 * 1024 * 1024;

@Controller('cv')
export class CvController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async upload(
    @Req() req: Request,
    @Headers('x-filename') filenameHeader?: string,
  ) {
    const buffer = req.body as Buffer;
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
      throw new BadRequestException('Archivo vacío');
    }
    if (buffer.length > MAX_BYTES) {
      throw new BadRequestException('El archivo supera los 10 MB');
    }
    if (buffer.subarray(0, 4).toString('latin1') !== '%PDF') {
      throw new BadRequestException('El archivo debe ser un PDF');
    }
    const file = await this.prisma.cvFile.create({
      data: {
        filename: this.safeName(filenameHeader) ?? 'cv.pdf',
        mimeType: 'application/pdf',
        size: buffer.length,
        data: new Uint8Array(buffer),
      },
      select: { id: true },
    });
    return { id: file.id, url: `/cv/${file.id}` };
  }

  @Get(':id')
  async download(@Param('id') id: string, @Res() res: Response) {
    const file = await this.prisma.cvFile.findUnique({ where: { id } });
    if (!file) {
      throw new NotFoundException();
    }
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);
    res.send(Buffer.from(file.data));
  }

  private safeName(name?: string): string | null {
    if (!name) {
      return null;
    }
    let decoded = name;
    try {
      decoded = decodeURIComponent(name);
    } catch {
      decoded = name;
    }
    const clean = decoded
      .replace(/[^a-zA-Z0-9._ -]/g, '_')
      .slice(0, 120)
      .trim();
    return clean || null;
  }
}
