import {db} from "@/lib/db";

function createPost() {
  return (
      <div>
        <h1>Create post</h1>
        <form>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" />

          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" />
        </form>
      </div>
  )
}

export default function Home({myPosts, friendsPosts}) {
  return (
      <div>
        <h1>Home Page</h1>

        <div>Take quizzes</div>

        <div>{createPost()}</div>

        <h2>View my posts</h2>
        <div>{
          myPosts.map((post) => (
              <div key={post.id}>
                <div>{post.title}</div>
                <div>{post.content}</div>
              </div>
          ))
        }</div>

        <h2>View feed</h2>
        <div>{
          friendsPosts.map((post) => (
              <div key={post.id}>
                <div>{post.title}</div>
                <div>{post.content}</div>
              </div>
          ))
        }</div>
      </div>
  )
}

export async function getServerSideProps(context) {
  // TODO: shte vidim kak shte vzimame id-tata, ili nqkakuv session/cookie-ta not sure yet
  const currentUserID = 1;

  const myPosts = await db.get(`
        SELECT *
        FROM posts
        WHERE user_id = ?;
    `, [currentUserID]);

  const friendsPosts = await db.get(`
        SELECT posts.*
        FROM posts
        INNER JOIN friendships ON (friendships.user_id = posts.user_id OR friendships.friend_id = posts.user_id)
        WHERE friendships.user_id = ? OR friendships.friend_id = ?;
    `, [currentUserID, currentUserID]);

  return {
    props: {
      myPosts,
      friendsPosts
    },
  };
}