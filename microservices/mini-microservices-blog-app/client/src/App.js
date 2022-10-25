import React from "react";
import CreatePost from "./CreatePost";
import PostList from "./PostList";

const App = () => {
  return (
    <div>
      <CreatePost />
      <hr />
      <PostList />
    </div>
  );
};

export default App;
