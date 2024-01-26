// pages/user/[userId].js
import { useRouter } from 'next/router';
import {db} from "@/lib/db";

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
  const { req } = context;
  const protocol = req.connection.encrypted ? 'https' : 'http';
  const baseUrl = `${protocol}://${req.headers.host}`;
  const { userId } = context.query;
  const currentUserID = req.cookies.user;


  try {

    const response = await fetch(`${baseUrl}/api/areFriends?user1Id=${currentUserID}&user2Id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });


    const data = await response.json();
    const areFriends = data.areFriends;

    const user = await db.get('SELECT id, username FROM users WHERE id = ?', [userId]);

    return {
      props: {
        user: {
          id: userId,
          username: user.username,
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
