import { db } from "@/lib/db";

export default async function handler(req, res) {
    if(req.method !== "DELETE") {
        res.status(405).json({ message: "Method not allowed" });
        return;
    }

    const { id } = req.body;

    const { lastID } = await db.run(`
        DELETE FROM posts
        WHERE id = ?
    `, [id]);

    res.json({ message: "Post deleted successfully.", id: lastID });
}