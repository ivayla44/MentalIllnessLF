// pages/api/addFriend.js
import { db } from '@/lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const { user1Id, user2Id } = req.body;

    try {
        // check if the users are not already friends
        const existingFriendship = await db.get(
            'SELECT * FROM friendships WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)',
            [user1Id, user2Id, user2Id, user1Id]
        );

        if (existingFriendship) {
            return res.status(400).json({ error: 'Users are already friends' });
        }

        // add a new friendship record
        await db.run('INSERT INTO friendships (user_id, friend_id) VALUES (?, ?)', [user1Id, user2Id]);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error adding friend:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
