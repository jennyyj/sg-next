import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const headersList = await headers();
    const userId = await headersList.get('userId');

    const phoneNumbers = await prisma.phoneNumber.findMany({
      where: { userId: userId as string }
    });

    return NextResponse.json({ phoneNumbers });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch phone numbers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const userId = await headersList.get('userId');
    const { name, number, category } = await request.json();

    const phoneNumber = await prisma.phoneNumber.create({
      data: {
        name,
        number,
        category,
        userId: userId as string
      }
    });

    return NextResponse.json({ phoneNumber }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add phone number' }, { status: 500 });
  }
}