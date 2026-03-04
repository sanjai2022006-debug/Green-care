import { useState, useEffect } from "react";
import api from "../api/api";
import moment from "moment";

const Feed = () => {

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [likingId, setLikingId] = useState(null);

  const [editingPost, setEditingPost] = useState(null);
  const [editCaption, setEditCaption] = useState("");

  /* LOAD POSTS */

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

  /* CREATE POST */

  const createPost = async () => {

    if (!caption.trim()) return;

    try {

      const formData = new FormData();
      formData.append("caption", caption);

      if (image) formData.append("image", image);

      await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      await loadPosts();

      setCaption("");
      setImage(null);

    } catch (err) {
      console.error(err);
    }

  };

  /* DELETE POST */

  const deletePost = async (id) => {

    if (!window.confirm("Delete this post?")) return;

    try {

      await api.delete(`/posts/${id}`);

      setPosts(prev => prev.filter(p => p._id !== id));

    } catch (err) {
      console.error(err);
    }

  };

  /* OPEN EDIT */

  const openEdit = (post) => {

    setEditingPost(post);
    setEditCaption(post.caption);

  };

  /* UPDATE POST */

  const updatePost = async () => {

    try {

      const res = await api.put(`/posts/${editingPost._id}`, {
        caption: editCaption
      });

      setPosts(prev =>
        prev.map(p =>
          p._id === editingPost._id ? res.data : p
        )
      );

      setEditingPost(null);

    } catch (err) {
      console.error(err);
    }

  };

  /* LIKE POST */

  const likePost = async (id) => {

    if (likingId === id) return;

    try {

      setLikingId(id);

      const res = await api.post(`/posts/${id}/like`);

      setPosts(prev =>
        prev.map(p =>
          p._id === id ? res.data : p
        )
      );

    } catch (err) {
      console.error(err);
    } finally {
      setLikingId(null);
    }

  };

  /* ADD COMMENT */

  const addComment = async (id) => {

    if (!commentText[id]?.trim()) return;

    try {

      const res = await api.post(`/posts/${id}/comment`, {
        text: commentText[id]
      });

      setPosts(prev =>
        prev.map(p =>
          p._id === id ? res.data : p
        )
      );

      setCommentText({ ...commentText, [id]: "" });

    } catch (err) {
      console.error(err);
    }

  };

  return (

    <div className="max-w-2xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6 text-green-700">
        🌿 GreenCare Feed
      </h1>

      {/* CREATE POST */}

      <div className="bg-white shadow rounded-xl p-5 mb-6 border">

        <textarea
          className="w-full border rounded-lg p-3"
          placeholder="Share something..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <div className="flex justify-between mt-4 items-center">

          <label className="bg-gray-100 px-4 py-2 rounded cursor-pointer">
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

      {posts.map(post => {

        const postUserId =
          typeof post.user === "object"
            ? post.user._id
            : post.user;

        const isOwner =
          postUserId?.toString() === currentUser?._id?.toString();

        const isLiked = post.likes?.some(
          (id) => id.toString() === currentUser?._id?.toString()
        );

        return (

          <div
            key={post._id}
            className="bg-white shadow rounded-xl p-5 mb-6 border"
          >

            {/* HEADER */}

            <div className="flex justify-between items-center mb-2">

              <p className="font-semibold text-gray-700">
                {post.user?.name || "User"}
              </p>

              {isOwner && (

                <div className="flex gap-3 text-sm">

                  <button
                    onClick={() => openEdit(post)}
                    className="text-blue-600"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => deletePost(post._id)}
                    className="text-red-600"
                  >
                    🗑 Delete
                  </button>

                </div>

              )}

            </div>

            <p>{post.caption}</p>

            {post.image && (
              <img
                src={`http://localhost:5000/uploads/${post.image}`}
                alt="post"
                className="mt-3 rounded-lg w-full"
              />
            )}

            <p className="text-sm text-gray-500 mt-2">
              {moment(post.createdAt).fromNow()}
            </p>

            {/* LIKE */}

            <div className="mt-4">

              <button
                onClick={() => likePost(post._id)}
                className={`font-medium ${
                  isLiked ? "text-red-600" : "text-gray-500"
                }`}
              >
                ❤️ {post.likes?.length || 0}
              </button>

            </div>

            {/* COMMENTS */}

            <div className="mt-4">

              {post.comments?.map(c => (

                <div
                  key={c._id}
                  className="bg-gray-100 p-2 rounded mb-2"
                >

                  <strong>{c.user?.name || "User"}:</strong> {c.text}

                </div>

              ))}

              <div className="flex mt-2 gap-2">

                <input
                  type="text"
                  placeholder="Add comment..."
                  value={commentText[post._id] || ""}
                  onChange={(e) =>
                    setCommentText({
                      ...commentText,
                      [post._id]: e.target.value
                    })
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

        );

      })}

      {/* EDIT MODAL */}

      {editingPost && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-96">

            <h2 className="text-xl font-bold mb-4">
              Edit Post
            </h2>

            <textarea
              className="w-full border p-2 rounded"
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-4">

              <button
                onClick={() => setEditingPost(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={updatePost}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default Feed;