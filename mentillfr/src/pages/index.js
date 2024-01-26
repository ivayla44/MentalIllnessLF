import {db} from "@/lib/db";
import {useState} from "react";
import {useRouter} from "next/router";

const users = {}

const Post = ({ post }) => {
    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/delete_post/`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({id: post.id}),
            });

            if (response.ok) {
                console.log('Post deleted successfully');
            } else {
                console.error('Error deleting post');
            }
        } catch (error) {
            console.error('Error during delete:', error);
        }
    };

    return (
        <div className="post-container">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <button className="delete-button" onClick={handleDelete}>
                Delete Post
            </button>
        </div>
    );
};

function createPost({userId}) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    return (
        <div>
        <form>
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" onChange={event => setTitle(event.target.value)} value={title}/>

            <label htmlFor="content">Content</label>
            <textarea id="content" name="content" onChange={event => setContent(event.target.value)} value={content}/>

            <button type="submit" onClick={ async (event) => {
                event.preventDefault();
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
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = () => {
        router.push(`/search?query=${searchQuery}`).then(r => console.log("Navigated to search page"));
    };

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

        
        <div>Take quizzes</div>

        <div>{createPost({ userId })}</div>

      <h2>View my posts</h2>
          <div className="post-section">
              {myPosts !== null ? (
                  Array.isArray(myPosts) ? (
                      myPosts.map((post) => (
                          <Post key={post.id} post={post} />
                      ))
                  ) : (
                      <Post key={myPosts.id} post={myPosts} />
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
                          <div className="post-container">
                              <h3>{post.title}</h3>
                              <p>{post.content}</p>
                          </div>
                      ))
                  ) : (
                      <div className="post-container">
                          <h3>{friendsPosts.title}</h3>
                          <p>{friendsPosts.content}</p>
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

        if (!userId) {
            console.log("Redirecting to login page...");
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        }

        const myPosts = await db.all(`
        SELECT *
        FROM posts
        WHERE user_id = ?;
    `, [userId]);

        const friendsPosts = await db.all(`
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