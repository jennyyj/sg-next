import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (jobId) {
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: { shift: true }
      });
      return NextResponse.json({ job });
    }

    const jobs = await prisma.job.findMany({
      include: { shift: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}