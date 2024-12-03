import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

type JobRequest = {
  businessName: string;
  jobDescription?: string;
  category: string;
  shift: {
    type: 'MORNING' | 'MIDDAY' | 'NIGHT' | 'CUSTOM';
    date?: string;
    startTime: string;
    endTime: string;
  };
};

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const authHeader = await headersList.get('authorization');
    const token = authHeader ? authHeader.split(' ')[1] : null;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json() as JobRequest;
    const { businessName, jobDescription, category, shift } = body;

    if (!businessName || !category || !shift.startTime || !shift.endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const jobData: Prisma.JobCreateInput = {
      businessName,
      jobDescription: jobDescription || '',
      category,
      shift: {
        create: {
          type: shift.type,
          date: shift.date ? new Date(shift.date) : new Date(),
          startTime: shift.startTime,
          endTime: shift.endTime
        }
      },
      user: {
        connect: {
          id: 'placeholder-user-id'
        }
      },
      status: 'PENDING'
    };

    const job = await prisma.job.create({
      data: jobData,
      include: {
        shift: true
      }
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}