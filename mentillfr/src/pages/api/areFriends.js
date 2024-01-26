// pages/api/areFriends.js
import { AsyncDatabase } from 'promised-sqlite3';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { user1Id, user2Id } = req.query;

  try {
    const db = new AsyncDatabase();
    const friendship = await db.get(
      'SELECT * FROM friendships WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)',
      [user1Id, user2Id, user2Id, user1Id]
    );
    db.close();

    const areFriends = !!friendship;
    res.status(200).json({ areFriends });
  } catch (error) {
    console.error('Error checking if users are friends:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
