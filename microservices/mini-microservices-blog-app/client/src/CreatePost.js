import React, { useState } from "react";
import axios from "axios";
export default () => {
  const [title, setTitle] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:4000/posts", { title });

    setTitle("");
  };
  return (
    <div>
      <h1>Create Post</h1>
      <form onSubmit={onSubmit}>
        <label htmlFor="title">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          name="title"
          id="title"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
