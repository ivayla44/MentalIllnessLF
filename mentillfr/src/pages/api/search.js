// pages/api/searchUsers.js
import { db } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { username } = req.body;

  try {
    const users = await db.all('SELECT id, username FROM users WHERE username LIKE ?', [`%${username}%`]);

    res.status(200).json(users);
  } catch (error) {
    console.error('Error searching for users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
