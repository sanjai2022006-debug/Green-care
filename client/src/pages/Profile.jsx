import { useEffect, useState } from "react";
import api from "../api/api";
import moment from "moment";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [message, setMessage] = useState("");

  /* ---------------- LOAD USER + POSTS ---------------- */
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) return;

    const loadProfilePosts = async () => {
      try {
        const res = await api.get("/posts");
        const myPosts = res.data.filter(
          (post) =>
            post.user?._id === storedUser?._id ||
            post.user === storedUser?._id
        );
        setPosts(myPosts);
      } catch (err) {
        console.error(err);
      }
    };

    setUser(storedUser);
    setName(storedUser.name || "");
    setBio(storedUser.bio || "");
    setInterests(storedUser.interests?.join(", ") || "");

    loadProfilePosts();
  }, []);

  if (!user) return <div className="p-6">Loading...</div>;

  const totalLikes = posts.reduce((acc, p) => acc + p.likes.length, 0);
  const totalComments = posts.reduce((acc, p) => acc + p.comments.length, 0);

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

      const res = await api.put(`/users/${user._id}`, formData);

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(res.data));

      // Update UI state
      setUser(res.data);
      setName(res.data.name || "");
      setBio(res.data.bio || "");
      setInterests(res.data.interests?.join(", ") || "");

      setMessage("🌿 Profile updated successfully!");
      setEditMode(false);
      setProfilePic(null);

      setTimeout(() => setMessage(""), 3000);

    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      setMessage("⚠️ Failed to update profile. Try again.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* PROFILE HEADER */}
      <div className="bg-white shadow rounded-xl p-6 mb-6 border border-green-200 flex flex-col sm:flex-row items-center sm:items-start gap-6">

        {/* PROFILE PIC */}
        <div className="relative">
          <img
            src={
              user.profilePic
                ? `http://localhost:5000/uploads/${user.profilePic}`
                : "https://cdn-icons-png.flaticon.com/512/219/219983.png"
            }
            alt="profile"
            className="w-32 h-32 object-cover rounded-full border-4 border-green-300"
          />
          <button
            onClick={() => {
              setEditMode(true);
              setName(user.name || "");
              setBio(user.bio || "");
              setInterests(
                Array.isArray(user.interests)
                  ? user.interests.join(", ")
                  : ""
              );
            }}
            className="absolute bottom-0 right-0 bg-green-600 text-white text-xs px-2 py-1 rounded-full"
          >
            ✏️
          </button>
        </div>

        {/* USER INFO */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-green-700">
            {user.name}
          </h2>
          <p className="text-gray-600 mt-1">{user.email}</p>

          {user.bio && (
            <p className="mt-2 text-gray-700 italic">“{user.bio}”</p>
          )}

          {user.interests?.length > 0 && (
            <p className="mt-2 text-sm text-green-700">
              🌱 Interests: {user.interests.join(", ")}
            </p>
          )}

          <div className="flex gap-6 mt-4 text-center">
            <div>
              <strong className="text-green-700">{posts.length}</strong>
              <p>Posts</p>
            </div>
            <div>
              <strong className="text-green-700">{totalLikes}</strong>
              <p>Likes</p>
            </div>
            <div>
              <strong className="text-green-700">{totalComments}</strong>
              <p>Comments</p>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {editMode && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-lg">
            <button
              onClick={() => setEditMode(false)}
              className="absolute top-3 right-4 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-green-700 mb-4 text-center">
              🌿 Edit GreenCare Profile
            </h3>

            <label className="block font-medium mb-1">Name</label>
            <input
              className="border rounded p-2 w-full mb-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label className="block font-medium mb-1">Bio</label>
            <textarea
              className="border rounded p-2 w-full mb-3"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />

            <label className="block font-medium mb-1">
              Interests (comma separated)
            </label>
            <input
              className="border rounded p-2 w-full mb-4"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />

            <label className="block font-medium mb-1">Profile Picture</label>
            <input
              type="file"
              onChange={(e) => setProfilePic(e.target.files[0])}
              className="mb-4"
            />

            <button
              onClick={updateAccount}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>

            {message && (
              <p className="mt-3 text-sm text-center text-gray-700">
                {message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* POSTS GRID */}
      <h3 className="text-xl font-bold mb-4 text-green-700">
        🌱 My Plant Posts
      </h3>

      {posts.length === 0 ? (
        <p className="text-gray-600">
          No posts yet. Share your first plant story!
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className="relative cursor-pointer overflow-hidden rounded-lg border border-green-100 shadow-sm hover:shadow-md transition"
              onClick={() => setSelectedPost(post)}
            >
              {post.image ? (
                <img
                  src={`http://localhost:5000/uploads/${post.image}`}
                  alt="plant"
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-48 bg-green-50">
                  🌿 No Image
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* POST MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-lg relative p-5 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-4 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-green-700 mb-2">
              {selectedPost.user?.name}
            </h3>

            {selectedPost.image && (
              <img
                src={`http://localhost:5000/uploads/${selectedPost.image}`}
                alt="plant"
                className="w-full rounded-lg mb-3"
              />
            )}

            <p className="text-gray-800 mb-3">
              {selectedPost.caption}
            </p>

            <p className="text-sm text-gray-500 mb-3">
              {moment(selectedPost.createdAt).fromNow()}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;