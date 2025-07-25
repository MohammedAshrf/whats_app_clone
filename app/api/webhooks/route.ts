// app/api/webhooks/clerk/route.ts
import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const eventType = evt.type;
    const user = evt.data;
    // const id = evt.data.id;
    // const username = evt.data.username;
    // const first_name = evt.data.first_name;
    // const last_name = evt.data.last_name;
    // const profilePicture = evt.data.image_url;
    // const last_active_at = evt.data.last_active_at;

    switch (eventType) {
      case 'user.created':
        if ('first_name' in user && 'last_name' in user) {
          await prisma.user.create({
            data: {
              clerkId: user.id,
              email: user.email_addresses[0]?.email_address || '',
              username: user.username || '',
              firstName: user.first_name,
              lastName: user.last_name,
              profilePicture: user.image_url || '',
              lastSeen: user.last_active_at
                ? new Date(user.last_active_at)
                : undefined,
            },
          });
        }
        console.log('User created:', user.id);

      case 'user.updated':
        if ('first_name' in user && 'last_name' in user) {
          await prisma.user.update({
            where: { clerkId: user.id },
            data: {
              clerkId: user.id,
              email: user.email_addresses[0]?.email_address || '',
              username: user.username || '',
              firstName: user.first_name,
              lastName: user.last_name,
              profilePicture: user.image_url || '',
              lastSeen: user.last_active_at
                ? new Date(user.last_active_at)
                : undefined,
            },
          });
        }
        console.log('User updated:', user.id);
        break;

      case 'user.deleted':
        await prisma.user.delete({
          where: { clerkId: user.id },
        });
        console.log('User deleted:', user.id);
        break;

      default:
        console.log('Unhandled event', eventType);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return new NextResponse('Webhook Error', { status: 400 });
  }
}

// import { verifyWebhook } from '@clerk/nextjs/webhooks';
// import { NextRequest } from 'next/server';

// export async function POST(req: NextRequest) {
//   try {
//     const evt = await verifyWebhook(req);

//     // Do something with payload
//     // For this guide, log payload to console
//     const { id } = evt.data;
//     const eventType = evt.type;

//     console.log(
//       `Received webhook with ID ${id} and event type of ${eventType}`,
//     );
//     console.log('Webhook payload:', evt.data);

//     if (evt.type === 'user.created') {
//       console.log('userId:', evt.data.id);
//       console.log('firstName:', evt.data.first_name);
//     }

//     return new Response('Webhook received', { status: 200 });
//   } catch (err) {
//     console.error('Error verifying webhook:', err);
//     return new Response('Error verifying webhook', { status: 400 });
//   }
// }
