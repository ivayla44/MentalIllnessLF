import { db } from "@/lib/db";

export default async function handler(req, res) {
    if(req.method !== "DELETE") {
        res.status(405).json({ message: "Method not allowed" });
        return;
    }

    const { id } = req.body;

    try {
        // Execute the DELETE query
        const { changes } = await db.run(`
      DELETE FROM posts
      WHERE id = ?
    `, [id]);

        if (changes > 0) {
            res.json({ message: "Post deleted successfully.", id });
        } else {
            res.status(404).json({ message: "Post not found." });
        }
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}