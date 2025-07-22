import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

interface User {
  id: number;
  phoneNumber: string;
  username: string | null;
  profilePicture: string | null;
  lastSeen: Date;
  createdAt: Date;
}

interface SuccessResponse {
  success: true;
  user: User;
}

interface ErrorResponse {
  error: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  try {
    // Test creating a user
    const user = await prisma.user.create({
      data: {
        phoneNumber: '+1234567890',
        username: 'Test User',
      },
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
}
