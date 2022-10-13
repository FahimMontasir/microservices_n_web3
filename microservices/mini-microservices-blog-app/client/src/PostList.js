import React, { useEffect, useState } from "react";
import axios from "axios";
import CreateComment from "./CreateComment";
import CommentList from "./CommentList";

export default () => {
  const [posts, setPosts] = useState({});

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:4000/posts");
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderedPost = Object.values(posts).map((post) => {
    return (
      <div key={post.id}>
        <h3>{post.title}</h3>
        <CommentList postId={post.id} />
        <CreateComment postId={post.id} />
        <hr />
      </div>
    );
  });

  return <div>{renderedPost}</div>;
};
