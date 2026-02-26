import { useState, useEffect } from "react";
import api from "../api/api";
import moment from "moment";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editText, setEditText] = useState("");
  const [commentText, setCommentText] = useState({});

  // Load posts
  const loadPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  // Create Post
  const createPost = async () => {
    if (!caption.trim()) return;

    try {
      const formData = new FormData();
      formData.append("caption", caption);
      if (image) {
        formData.append("image", image);
      }

      await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCaption("");
      setImage(null);
      loadPosts();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Post
  const deletePost = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      loadPosts();
    } catch (err) {
      console.error(err);
    }
  };

  // Like
  const likePost = async (id) => {
    try {
      await api.post(`/posts/${id}/like`);
      loadPosts();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit Start
  const startEditing = (post) => {
    setEditingPostId(post._id);
    setEditText(post.caption);
  };

  // Save Edit
  const saveEdit = async (id) => {
    try {
      await api.put(`/posts/${id}`, { caption: editText });
      setEditingPostId(null);
      setEditText("");
      loadPosts();
    } catch (err) {
      console.error(err);
    }
  };

  // Add Comment
  const addComment = async (id) => {
    if (!commentText[id]?.trim()) return;

    try {
      await api.post(`/posts/${id}/comment`, {
        text: commentText[id],
      });

      setCommentText({
        ...commentText,
        [id]: "",
      });

      loadPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-green-700">
        🌿 GreenCare Feed
      </h1>

      {/* Create Post */}
      <div className="bg-white shadow-md rounded-xl p-5 mb-6 border border-gray-200">
        <textarea
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-400 outline-none"
          placeholder="Share something about your plant..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
          <label className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer transition">
            Choose File
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
            />
          </label>

          <button
            onClick={createPost}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
          >
            Post
          </button>
        </div>
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white shadow-md rounded-xl p-5 mb-6 border border-gray-200"
        >
          {/* Caption */}
          {editingPostId === post._id ? (
            <>
              <textarea
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <button
                onClick={() => saveEdit(post._id)}
                className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg transition"
              >
                Save
              </button>
            </>
          ) : (
            <p className="text-lg font-medium">{post.caption}</p>
          )}

          {/* Image */}
          {post.image && (
            <img
              src={`http://localhost:5000/uploads/${post.image}`}
              alt="post"
              className="mt-3 rounded-lg max-h-96 object-cover w-full"
            />
          )}

          {/* Time */}
          <p className="text-sm text-gray-500 mt-2">
            {moment(post.createdAt).fromNow()}
          </p>

          {/* Buttons */}
          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              onClick={() => likePost(post._id)}
              className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-lg transition"
            >
              ❤️ {post.likes.length}
            </button>

            <button
              onClick={() => startEditing(post)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded-lg transition"
            >
              Edit
            </button>

            <button
              onClick={() => deletePost(post._id)}
              className="bg-gray-100 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg transition"
            >
              Delete
            </button>
          </div>

          {/* Comments */}
          <div className="mt-5">
            <h3 className="font-semibold mb-2 text-gray-700">
              Comments
            </h3>

            {post.comments.map((c, index) => (
              <p
                key={index}
                className="text-sm bg-gray-100 p-2 rounded-lg mb-2"
              >
                {c.text}
              </p>
            ))}

            <div className="flex mt-2 gap-2">
              <input
                type="text"
                placeholder="Add comment..."
                className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                value={commentText[post._id] || ""}
                onChange={(e) =>
                  setCommentText({
                    ...commentText,
                    [post._id]: e.target.value,
                  })
                }
              />
              <button
                onClick={() => addComment(post._id)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-lg transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;