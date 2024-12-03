import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { jobId, workerName } = await request.json();

    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.claimedBy) {
      return NextResponse.json({ error: 'Job already claimed' }, { status: 400 });
    }

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        claimedBy: workerName,
        claimedAt: new Date(),
        status: 'CLAIMED'
      }
    });

    return NextResponse.json({ job: updatedJob });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to claim job' }, { status: 500 });
  }
}