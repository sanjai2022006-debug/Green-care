
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/api";
import moment from "moment";

const Profile = () => {

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");

  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);

  const [message, setMessage] = useState("");
  const location = useLocation();

  /* ---------------- LOAD USER POSTS ---------------- */

  async function loadProfilePosts(userId) {

    try {

      const res = await api.get("/posts");

      const myPosts = res.data.filter((post) => {

        if (!post.user) return false;

        const postUserId = typeof post.user === "object"
          ? post.user._id
          : post.user;

        return String(postUserId) === String(userId);

      });

      setPosts(myPosts);

    } catch (err) {
      console.error(err);
    }

  }

  useEffect(() => {

  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser) return;

  setUser(storedUser);
  setName(storedUser.name || "");
  setBio(storedUser.bio || "");
  setInterests(storedUser.interests?.join(", ") || "");

  loadProfilePosts(storedUser._id);

}, [location]);

 /* ---------------- LOAD PROFILE ---------------- */

useEffect(() => {

  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser) return;

  // set user data
  setUser(storedUser);
  setName(storedUser.name || "");
  setBio(storedUser.bio || "");
  setInterests(storedUser.interests?.join(", ") || "");

  // 🔑 load posts immediately using stored user
  loadProfilePosts(storedUser._id);

}, []);

if (!user) return <div className="p-6">Loading...</div>;
  /* ---------------- PROFILE COUNTS ---------------- */

  const totalLikes = posts.reduce(
    (acc, p) => acc + (p.likes?.length || 0),
    0
  );

  const totalComments = posts.reduce(
    (acc, p) => acc + (p.comments?.length || 0),
    0
  );

  /* ---------------- UPDATE ACCOUNT ---------------- */

  const updateAccount = async () => {

    try {

      const formData = new FormData();

      formData.append("name", name);
      formData.append("bio", bio);
      formData.append("interests", interests);

      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      const res = await api.put(
        "/users/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      localStorage.setItem("user", JSON.stringify(res.data));

      setUser(res.data);

      loadProfilePosts(res.data._id);

      setProfilePic(null);
      setPreview(null);

      setMessage("🌿 Profile updated successfully!");

      setTimeout(() => setMessage(""), 3000);

    } catch (err) {

      console.error(err.response?.data || err);

      setMessage("⚠️ Failed to update profile.");

    }

  };

  return (

    <div className="max-w-5xl mx-auto p-6">

      {message && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {message}
        </div>
      )}

      {/* PROFILE HEADER */}

      <div className="bg-white shadow rounded-xl p-6 mb-6 border border-green-200 flex flex-col sm:flex-row items-center gap-6">

        <div className="relative">

          <img
            src={
              preview
                ? preview
                : user.profilePic
                ? `http://localhost:5000/uploads/${user.profilePic}`
                : "https://cdn-icons-png.flaticon.com/512/219/219983.png"
            }
            alt="profile"
            className="w-32 h-32 object-cover rounded-full border-4 border-green-300"
          />

          <button
            onClick={updateAccount}
            className="absolute bottom-0 right-0 bg-green-600 text-white text-xs px-2 py-1 rounded-full"
          >
            ✏️
          </button>

        </div>

        <div className="flex-1">

          <h2 className="text-2xl font-bold text-green-700">
            {user.name}
          </h2>

          <p className="text-gray-600 mt-1">
            {user.email}
          </p>

          {user.bio && (
            <p className="mt-2 italic text-gray-700">
              “{user.bio}”
            </p>
          )}

          {user.interests?.length > 0 && (
            <p className="mt-2 text-sm text-green-700">
              🌱 Interests: {user.interests.join(", ")}
            </p>
          )}

          <div className="flex gap-6 mt-4 text-center">

            <div>
              <strong className="text-green-700">
                {posts.length}
              </strong>
              <p>Posts</p>
            </div>

            <div>
              <strong className="text-green-700">
                {totalLikes}
              </strong>
              <p>Likes</p>
            </div>

            <div>
              <strong className="text-green-700">
                {totalComments}
              </strong>
              <p>Comments</p>
            </div>

          </div>

        </div>

      </div>

      {/* POSTS GRID */}

      <h3 className="text-xl font-bold mb-4 text-green-700">
        🌱 My Plant Posts
      </h3>

      {posts.length === 0 ? (

        <p>No posts yet. Share your first plant story!</p>

      ) : (

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

          {posts.map((post) => (

            <div
              key={post._id}
              className="relative cursor-pointer rounded-lg overflow-hidden border shadow hover:shadow-lg transition"
              onClick={() => setSelectedPost(post)}
            >

              {post.image ? (

                <img
                  src={`http://localhost:5000/uploads/${post.image}`}
                  className="w-full h-48 object-cover"
                  alt="post"
                />

              ) : (

                <div className="flex items-center justify-center h-48 bg-green-50">
                  🌿 No Image
                </div>

              )}

              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 flex items-center justify-center text-white gap-6 transition">

                ❤️ {post.likes?.length || 0}
                💬 {post.comments?.length || 0}

              </div>

            </div>

          ))}

        </div>

      )}

      {/* POST MODAL */}

      {selectedPost && (

        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl max-w-lg w-full p-5 relative">

            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-4 text-xl"
            >
              ✕
            </button>

            <h3 className="font-bold text-green-700 mb-2">
              {selectedPost.user?.name}
            </h3>

            {selectedPost.image && (
              <img
                src={`http://localhost:5000/uploads/${selectedPost.image}`}
                className="w-full rounded mb-3"
                alt="post"
              />
            )}

            <p>{selectedPost.caption}</p>

            <p className="text-sm text-gray-500 mt-2">
              {moment(selectedPost.createdAt).fromNow()}
            </p>

          </div>

        </div>

      )}

    </div>

  );

};

export default Profile;