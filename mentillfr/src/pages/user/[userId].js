// pages/user/[userId].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const UserProfilePage = ({ user, areFriends }) => {
  const router = useRouter();

  return (
    <div>
      <h1>User Profile</h1>
      <p>Username: {user.username}</p>

      {areFriends ? (
        <p>This user is already your friend.</p>
      ) : (
        <p>Not friends yet. Add as a friend!</p>
      )}
    </div>
  );
};

export default UserProfilePage;

export async function getServerSideProps(context) {
  const { userId } = context.query;
  const currentUserID = context.req.session.currentUserID;

  try {
    // Check if the user is already a friend using the API endpoint
    const response = await fetch(`/api/areFriends?user1Id=${currentUserID}&user2Id=${userId}`);
    const data = await response.json();
    const areFriends = data.areFriends;

    // Continue with other logic as needed
    // ...

    return {
      props: {
        user: {
          id: userId, // Adjust this based on your actual user data
          username: 'ExampleUsername', // Adjust this based on your actual user data
        },
        areFriends,
      },
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      notFound: true,
    };
  }
}
