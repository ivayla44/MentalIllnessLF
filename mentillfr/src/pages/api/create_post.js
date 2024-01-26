import { db } from "@/lib/db";

export default async function handler(req, res) {
    if(req.method !== "POST") {
        res.status(405).json({ message: "Method not allowed" });
        return;
    }

    const { userId, title, content } = req.body;

    try {
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const { lastID } = await db.run(`
            INSERT INTO posts (user_id, title, content)
            VALUES (?, ?, ?)
        `, [userId, title, content]
        );

        const post = await db.get(`SELECT * FROM posts WHERE id = ?`, [lastID]);

        res.json(post);

    } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({ message: 'Internal Server Error' });
    }
}
