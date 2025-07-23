'use client';

import ChatList from '@/components/shared/ChatList';
import { SignIn, useUser } from '@clerk/nextjs';
// import { SignIn } from '@clerk/clerk-react';
// import { useUser } from '@clerk/nextjs';

export default function Chats() {
  // const { isSignedIn, user } = useUser();
  // const { id, firstName, lastName, emailAddresses } = user || {};
  // console.log('isSignedIn:', isSignedIn);
  // // console.log('user:', user)
  // console.log(
  //   'userId:',
  //   id,
  //   '\n',
  //   'firstName:',
  //   firstName,
  //   '\n',
  //   'lastName:',
  //   lastName,
  //   '\n',
  //   'emailAddresses:',
  //   emailAddresses,
  // );

  // if (!user) return <SignIn />;

  return <ChatList />;
}
