import {db} from "@/lib/db";
import {useState} from "react";
import jwt from "jsonwebtoken";

const SECRET_KEY = 'iva_e_mnogo_qka'; // Set a secret key for JWT

function createPost() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    return (
        <div>
        <h1>Create post</h1>
        <form>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" onChange={event => setTitle(event.target.value)} value={title}/>

            <label htmlFor="content">Content</label>
            <textarea id="content" name="content" onChange={event => setContent(event.target.value)} value={content}/>

            <button type="submit" onClick={ async () => {
                const res = await fetch("/api/posts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({title, content})
                });
                // const post = await res.json();
            }}>Create post</button>
        </form>
        </div>
    )
}

export default function Home({myPosts, friendsPosts}) {
  return (
      <div>

        {/* Search bar */}
        <input
            type="text"
            placeholder="Search for users"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>

        <br />
        
        {/* Links to login and signup */}
        <Link href="/login">
            <a>Login</a>
        </Link>
        <br />
        <Link href="/signup">
            <a>Signup</a>
        </Link>
        
        <div>Take quizzes</div>

        <div>{createPost()}</div>

        <h2>View my posts</h2>
            <div>
              {myPosts !== null ? (
                  myPosts.map((post) => (
                      <div key={post.id}>
                          <div>{post.title}</div>
                          <div>{post.content}</div>
                      </div>
                  ))
              ) : (
                  <p>No posts available.</p>
              )}
            </div>

        <h2>View feed</h2>
            <div>
              {friendsPosts !== null ? (
                  friendsPosts.map((post) => (
                      <div key={post.id}>
                          <div>{post.title}</div>
                          <div>{post.content}</div>
                      </div>
                  ))
              ) : (
                  <p>No feed posts available.</p>
              )}
            </div>
      </div>
  )
}

export async function getServerSideProps(context) {
    // TODO: shte vidim kak shte vzimame id-tata, ig nqkakuv session/cookie-ta not sure yet

    try {
        const token = localStorage.getItem("token") || {};
        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.userId || {};

        if (!userId) {
            console.log("Redirecting to login page...");

            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        }

        const myPosts = await db.get(`
        SELECT *
        FROM posts
        WHERE user_id = ?;
    `, [userId]);

        const friendsPosts = await db.get(`
        SELECT posts.*
        FROM posts
        INNER JOIN friendships ON (friendships.user_id = posts.user_id OR friendships.friend_id = posts.user_id)
        WHERE friendships.user_id = ? OR friendships.friend_id = ?;
    `, [userId, userId]);

        return {
            props: {
                myPosts: myPosts || null,
                friendsPosts: friendsPosts || null,
            },
        };
    } catch (error) {
        console.error("Error fetching data:", error);

        return {
            props: {
                myPosts: null,
                friendsPosts: null,
            },
        };
    }
}