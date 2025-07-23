import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  const { id, email_addresses, username } = body;

  const email = email_addresses?.[0]?.email_address || '';

  await prisma.user.upsert({
    where: { clerkId: id },
    update: { email, username },
    create: {
      clerkId: id,
      email,
      username,
      phoneNumber: '',
    },
  });

  return NextResponse.json({ success: true });
}
