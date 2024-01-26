const { AsyncDatabase } = require("promised-sqlite3");

const dbPromise = (async () => {
    try {
        // Create the AsyncDatabase object and open the database.
        const db = await AsyncDatabase.open("./db.sqlite");

        // Access the inner sqlite3.Database object to use the API that is not exposed by AsyncDatabase.
        db.inner.on("trace", (sql) => console.log("[TRACE]", sql));

        await db.run(`
            CREATE TABLE IF NOT EXISTS tests (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    questions TEXT NOT NULL,
                    answers TEXT NOT NULL
            )
        `);

        await db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
        `);

        await db.run(`
            CREATE TABLE IF NOT EXISTS friendships (
                    user_id INTEGER,
                    friend_id INTEGER,
                    FOREIGN KEY (user_id) REFERENCES users(id),
                    FOREIGN KEY (friend_id) REFERENCES users(id),
                    PRIMARY KEY (user_id, friend_id)
            )
        `);

        await db.run(`
            CREATE TABLE IF NOT EXISTS posts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    title TEXT NOT NULL,
                    content TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);

        return db;
    } catch (err) {
        console.error(err);
    }
})();

const db = {
    async all(...args) {
        try {
            return (await dbPromise).all(...args);
        } catch (error) {
            console.error("Error in db.all:", error);
            throw error;
        }
    },

    async run(...args) {
        try {
            return (await dbPromise).run(...args);
        } catch (error) {
            console.error("Error in db.run:", error);
            throw error;
        }
    },

    async get(...args) {
        try {
            return (await dbPromise).get(...args);
        } catch (error) {
            console.error("Error in db.get:", error);
            throw error;
        }
    },
};

export { db }
