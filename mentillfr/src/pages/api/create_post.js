import { db } from "@/lib/db";

export default async function handler(req, res) {
    if(req.method !== "POST") {
        res.status(405).json({ message: "Method not allowed" });
        return;
    }

    const { title, content } = req.body;

    const { lastID } = await db.run(`
        INSERT INTO posts (title, content)
        VALUES (?, ?)
    `, [title, content]
    );

    const post = await db.get(`SELECT * FROM posts WHERE id = ?`, [lastID]);

    res.json(post);
}
