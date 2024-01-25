import { db } from "@/lib/db";

export default async function handler(req, res) {
    if(req.method !== "PUT") {
        res.status(405).json({ message: "Method not allowed" });
        return;
    }

    const { id, title, content } = req.body;

    const { lastID } = await db.run(`
        UPDATE posts
        SET title = ?, content = ?
        WHERE id = ?
    `, [title, content, id]);

    const post = await db.get(`SELECT * FROM posts WHERE id = ?`, [id]);

    res.json({ post: post, message: "Post updated successfully.", id: lastID });
}