import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const headersList = await headers();
    const userId = await headersList.get('userId');

    const userPreferences = await prisma.userPreference.findUnique({
      where: { userId: userId as string }
    });

    return NextResponse.json({ preferences: userPreferences });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const userId = await headersList.get('userId');
    const { shiftTimes } = await request.json();

    const preferences = await prisma.userPreference.upsert({
      where: { userId: userId as string },
      update: { shiftTimes },
      create: {
        userId: userId as string,
        shiftTimes
      }
    });

    return NextResponse.json({ preferences });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}