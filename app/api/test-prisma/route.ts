import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        username: 'Test User',
      },
    });
    return Response.json({ success: true, user });
  } catch (error) {
    // if (
    //   error &&
    //   typeof error === 'object' &&
    //   'code' in error &&
    //   error.code === 'P2002'
    // ) {
    //   // Prisma unique constraint error
    //   console.log('Error: Phone number already exists!');
    //   // Handle duplicate phone number
    // }
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
