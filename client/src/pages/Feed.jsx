import { useState, useEffect } from "react";
import api from "../api/api";
import moment from "moment";

const Feed = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editText, setEditText] = useState("");
  const [commentText, setCommentText] = useState({});

  /* ---------------- LOAD POSTS ---------------- */
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

    // 🔄 Auto refresh every 5 seconds
    const interval = setInterval(() => {
      loadPosts();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /* ---------------- CREATE POST ---------------- */
  const createPost = async () => {
    if (!caption.trim()) return;

    try {
      const formData = new FormData();
      formData.append("caption", caption);
      if (image) formData.append("image", image);

      const res = await api.post("/posts", formData);

      setPosts((prev) => [res.data, ...prev]);
      setCaption("");
      setImage(null);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- DELETE POST ---------------- */
  const deletePost = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((post) => post._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- LIKE POST ---------------- */
  const likePost = async (id) => {
    try {
      const res = await api.post(`/posts/${id}/like`);
      setPosts((prev) => prev.map((post) => (post._id === id ? res.data : post)));
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- EDIT POST ---------------- */
  const saveEdit = async (id) => {
    try {
      const res = await api.put(`/posts/${id}`, {
        caption: editText,
      });
      setPosts((prev) => prev.map((post) => (post._id === id ? res.data : post)));
      setEditingPostId(null);
      setEditText("");
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- ADD COMMENT ---------------- */
  const addComment = async (id) => {
    if (!commentText[id]?.trim()) return;

    try {
      const res = await api.post(`/posts/${id}/comment`, {
        text: commentText[id],
      });

      setPosts((prev) => prev.map((post) => (post._id === id ? res.data : post)));
      setCommentText((prev) => ({
        ...prev,
        [id]: "",
      }));
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- DELETE COMMENT ---------------- */
  const deleteComment = async (postId, commentId) => {
    try {
      const res = await api.delete(`/posts/${postId}/comment/${commentId}`);
      setPosts((prev) => prev.map((post) => (post._id === postId ? res.data : post)));
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-green-700">
        🌿 GreenCare Feed
      </h1>

      {/* CREATE POST */}
      <div className="bg-white shadow-md rounded-xl p-5 mb-6 border">
        <textarea
          className="w-full border rounded-lg p-3"
          placeholder="Share something..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <div className="flex justify-between mt-4 items-center">
          <label className="bg-gray-100 px-4 py-2 rounded cursor-pointer hover:bg-gray-200">
            Choose File
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
            />
          </label>

          <button
            onClick={createPost}
            className="bg-green-600 text-white px-5 py-2 rounded-lg"
          >
            Post
          </button>
        </div>
      </div>

      {/* POSTS */}
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white shadow-md rounded-xl p-5 mb-6 border"
        >
          {/* OWNER */}
          <p className="font-semibold text-gray-700 mb-2">
            {post.user?.name}
          </p>

          {/* CAPTION */}
          {editingPostId === post._id ? (
            <>
              <textarea
                className="w-full border p-2"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <button
                onClick={() => saveEdit(post._id)}
                className="bg-blue-500 text-white px-3 py-1 mt-2 rounded"
              >
                Save
              </button>
            </>
          ) : (
            <p>{post.caption}</p>
          )}

          {/* IMAGE */}
          {post.image && (
            <img
              src={`http://localhost:5000/uploads/${post.image}`}
              className="mt-3 rounded-lg"
            />
          )}

          {/* TIME */}
          <p className="text-sm text-gray-500 mt-2">
            {moment(post.createdAt).fromNow()}
          </p>

          {/* ACTIONS */}
          <div className="flex gap-4 mt-4 items-center">
            {/* LIKE */}
            <button
              onClick={() => likePost(post._id)}
              className="text-red-500 font-medium"
            >
              ❤️ {post.likes.length}
            </button>

            {/* OWNER CONTROLS */}
            {post.user?._id === currentUser?._id && (
              <>
                <button
                  onClick={() => {
                    setEditingPostId(post._id);
                    setEditText(post.caption);
                  }}
                  className="text-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() => deletePost(post._id)}
                  className="text-gray-600"
                >
                  Delete
                </button>
              </>
            )}
          </div>

          {/* COMMENTS */}
          <div className="mt-4">
            {post.comments.map((c) => (
              <div
                key={c._id}
                className="flex justify-between bg-gray-100 p-2 rounded mb-2"
              >
                <span>
                  <strong>{c.user?.name}:</strong> {c.text}
                </span>

                {c.user?._id === currentUser?._id && (
                  <button
                    onClick={() => deleteComment(post._id, c._id)}
                    className="text-red-500 text-xs"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}

            <div className="flex mt-2 gap-2">
              <input
                type="text"
                placeholder="Add comment..."
                value={commentText[post._id] || ""}
                onChange={(e) =>
                  setCommentText((prev) => ({
                    ...prev,
                    [post._id]: e.target.value,
                  }))
                }
                className="flex-1 border rounded p-2"
              />
              <button
                onClick={() => addComment(post._id)}
                className="bg-green-600 text-white px-4 rounded"
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