import { useEffect, useState } from "react";
import api from "../api/api";
import moment from "moment";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    password: "",
    profilePic: null,
  });

  // LOAD PROFILE
  const loadProfile = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) return;

      setUser(storedUser);

      setFormData({
        name: storedUser.name || "",
        email: storedUser.email || "",
        bio: storedUser.bio || "",
        password: "",
        profilePic: null,
      });

      const res = await api.get("/posts");

      const myPosts = res.data.filter(
        (post) =>
          post.user &&
          (post.user._id === storedUser._id ||
            post.user === storedUser._id)
      );

      setPosts(myPosts);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // SAVE PROFILE
  const saveProfile = async () => {
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("bio", formData.bio);
      form.append("password", formData.password);

      if (formData.profilePic) {
        form.append("profilePic", formData.profilePic);
      }

      const res = await api.put("/auth/update", form);

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));

      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  const totalLikes = posts.reduce(
    (acc, post) => acc + post.likes.length,
    0
  );

  const totalComments = posts.reduce(
    (acc, post) => acc + post.comments.length,
    0
  );

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* PROFILE HEADER */}
      <div className="bg-white shadow-xl rounded-2xl p-6 mb-8 border flex flex-col md:flex-row gap-6 items-center justify-between">

        <div className="flex items-center gap-6">

          {/* PROFILE PIC */}
          {user.profilePic ? (
            <img
              src={`http://localhost:5000/uploads/${user.profilePic}`}
              className="w-28 h-28 rounded-full object-cover"
              alt="profile"
            />
          ) : (
            <div className="w-28 h-28 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-4xl font-bold">
              {(user.name || user.email)?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* USER INFO */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {user.name || "Your Name"}
            </h2>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-green-600 mt-1">
              {user.bio || "🌿 Plant Care Enthusiast"}
            </p>

            <div className="flex gap-6 mt-4">
              <div>
                <p className="font-bold text-green-600">{posts.length}</p>
                <p className="text-sm text-gray-500">Posts</p>
              </div>
              <div>
                <p className="font-bold text-red-500">{totalLikes}</p>
                <p className="text-sm text-gray-500">Likes</p>
              </div>
              <div>
                <p className="font-bold text-blue-500">{totalComments}</p>
                <p className="text-sm text-gray-500">Comments</p>
              </div>
            </div>
          </div>
        </div>

        {/* EDIT BUTTON */}
        <button
          onClick={() => setEditMode(!editMode)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          {editMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {/* EDIT FORM */}
      {editMode && (
        <div className="bg-white shadow p-6 rounded-xl mb-8 border">
          <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>

          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full border p-3 rounded mb-3"
          />

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full border p-3 rounded mb-3"
          />

          <textarea
            placeholder="Bio"
            value={formData.bio}
            onChange={(e) =>
              setFormData({ ...formData, bio: e.target.value })
            }
            className="w-full border p-3 rounded mb-3"
          />

          <input
            type="password"
            placeholder="New Password"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full border p-3 rounded mb-3"
          />

          <input
            type="file"
            onChange={(e) =>
              setFormData({ ...formData, profilePic: e.target.files[0] })
            }
            className="mb-4"
          />

          <button
            onClick={saveProfile}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* MY POSTS */}
      <div>
        <h3 className="text-xl font-bold mb-5 text-green-700">
          🌿 My Posts
        </h3>

        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              onClick={() =>
                setExpandedPost(
                  expandedPost === post._id ? null : post._id
                )
              }
              className="bg-white shadow-md rounded-xl p-5 mb-6 border cursor-pointer hover:shadow-xl transition"
            >
              <div className="flex justify-between items-center">
                <p className="font-medium">
                  {post.caption}
                </p>

                <span className="text-sm text-gray-500">
                  {moment(post.createdAt).fromNow()}
                </span>
              </div>

              {expandedPost === post._id && (
                <div className="mt-4 border-t pt-4">

                  {post.image && (
                    <img
                      src={`http://localhost:5000/uploads/${post.image}`}
                      alt="post"
                      className="rounded-lg mb-4 max-h-72 object-cover w-full"
                    />
                  )}

                  <div className="flex justify-between text-sm text-gray-600 mb-3">
                    <span>❤️ {post.likes.length} Likes</span>
                    <span>💬 {post.comments.length} Comments</span>
                  </div>

                  <div>
                    {post.comments.map((c, index) => (
                      <p
                        key={index}
                        className="bg-gray-100 p-2 rounded mb-2 text-sm"
                      >
                        {c.text}
                      </p>
                    ))}
                  </div>

                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default Profile;