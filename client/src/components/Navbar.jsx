import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // important for profile page
    navigate("/");
  };

  return (
    <div className="bg-green-700 text-white px-6 py-4 flex justify-between items-center shadow">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/feed")}
      >
        GreenCare 🌿
      </h1>

      <div className="flex gap-6 items-center">
        <button
          onClick={() => navigate("/feed")}
          className="hover:underline"
        >
          Feed
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="hover:underline"
        >
          Profile
        </button>

        <button
          onClick={() => navigate("/reminders")}
          className="hover:underline"
        >
          Reminders
        </button>

        <button
          onClick={logout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}