// pages/user/[userId].js
import { db } from '@/lib/db';

const UserProfilePage = ({ user, areFriends, currentUser }) => {
  const handleAddFriend = async () => {
    try {
      const response = await fetch(`/api/addFriend?user1Id=${currentUser.id}&user2Id=${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user1Id: currentUser.id, user2Id: user.id }),
      });

      if (response.ok) {
        // Assuming the friend request was successful, you might want to update the UI accordingly
        console.log('Friend request sent successfully');
      } else {
        console.error('Friend request failed');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  return (
      <div>
        <h1>User Profile</h1>
        <p>Username: {user.username}</p>

        {areFriends ? (
            <p>This user is already your friend.</p>
        ) : (
            <div>
              <p>Not friends yet.</p>
              <button onClick={handleAddFriend}>Add as a friend</button>
            </div>
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
        currentUser: {
            id: currentUserID,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return {
      notFound: true,
    };
  }
}
