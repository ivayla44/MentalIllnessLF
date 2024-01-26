// pages/user/[userId].js
import { db } from '@/lib/db';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const UserProfilePage = ({ user, isFriend }) => {
  const router = useRouter();

  return (
    <div>
      <h1>User Profile</h1>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UserProfilePage;

export async function getServerSideProps(context) {
  const { userId } = context.query;

  try {
    const user = await db.get('SELECT id, username, email FROM users WHERE id = ?', [userId]);

    if (!user) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        user,
      },
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      notFound: true,
    };
  }
}
