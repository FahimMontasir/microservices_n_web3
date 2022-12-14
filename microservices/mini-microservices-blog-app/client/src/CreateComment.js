import React, { useState } from "react";
import axios from "axios";

const CreateComment = ({ postId }) => {
  const [content, setContent] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`http://posts.com/posts/${postId}/comments`, {
      content,
    });

    setContent("");
  };

  return (
    <div>
      <h4>Create comment</h4>
      <form onSubmit={onSubmit}>
        <label htmlFor="content">comment</label>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          type="text"
          name="content"
          id="content"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateComment;
