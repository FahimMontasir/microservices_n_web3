import React from "react";
import CreatePost from "./CreatePost";
import PostList from "./PostList";

export default () => {
  return (
    <div>
      <CreatePost />
      <hr />
      <PostList />
    </div>
  );
};
