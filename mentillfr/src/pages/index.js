import {db} from "@/lib/db";
import {useState} from "react";

const users = {}


function createPost({userId}) {
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
                const res = await fetch("/api/create_post", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({userId, title, content}),
                });
                if (res.ok) {
                    const post = await res.json();
                    console.log("Post created successfully:", post);
                } else {
                    console.error("Error creating post:", res.statusText);
                }
            }}>Create post</button>
        </form>
        </div>
    )
}

export default function Home({userId, myPosts, friendsPosts}) {
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

        <div>{createPost({ userId })}</div>

      <h2>View my posts</h2>
          <div>
              {myPosts !== null ? (
                  Array.isArray(myPosts) ? (
                      myPosts.map((post) => (
                          <div key={post.id}>
                              <div>{post.title}</div>
                              <div>{post.content}</div>
                          </div>
                      ))
                  ) : (
                      <div key={myPosts.id}>
                          <div>{myPosts.title}</div>
                          <div>{myPosts.content}</div>
                      </div>
                  )
              ) : (
                  <p>No posts available.</p>
              )}
          </div>

          <h2>View feed</h2>
          <div>
              {friendsPosts !== null ? (
                  Array.isArray(friendsPosts) ? (
                      friendsPosts.map((post) => (
                          <div key={post.id}>
                              <div>{post.title}</div>
                              <div>{post.content}</div>
                          </div>
                      ))
                  ) : (
                      <div key={friendsPosts.id}>
                          <div>{friendsPosts.title}</div>
                          <div>{friendsPosts.content}</div>
                      </div>
                  )
              ) : (
                  <p>No feed posts available.</p>
              )}
          </div>
      </div>
  )
}

export async function getServerSideProps(context) {

    try {
        const { req } = context;
        const session = req.cookies.session;
        const user = req.cookies.user;

        if(!users[session]) {
            users[session] = user;
        }
        const userId = users[session];

        console.log("User id:", userId, "Session:", session)

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

        console.log("My posts:", myPosts);
        console.log(Array.isArray(myPosts));

        const friendsPosts = await db.get(`
        SELECT posts.*
        FROM posts
        INNER JOIN friendships ON (friendships.user_id = posts.user_id OR friendships.friend_id = posts.user_id)
        WHERE friendships.user_id = ? OR friendships.friend_id = ?;
    `, [userId, userId]);

        return {
            props: {
                userId: userId || null,
                myPosts: myPosts || null,
                friendsPosts: friendsPosts || null,
            },
        };
    } catch (error) {
        console.error("Error fetching data:", error);

        return {
            props: {
                userId: null,
                myPosts: null,
                friendsPosts: null,
            },
        };
    }
}