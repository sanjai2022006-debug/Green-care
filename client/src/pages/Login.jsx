import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const Login = () => {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    // Validation
    if (!form.email || !form.password || (isRegister && !form.name)) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      // Combined login/register API call
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
        username: form.name,
        type: isRegister ? "register" : "login",
      });

      // Save to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Navigate after success
      navigate("/welcome");

    } catch (err) {
      console.error("Auth Error:", err);
      setError(
        err.response?.data?.message || 
        "Invalid credentials or server error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-200 to-green-400">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md">
        
        {/* Logo Section */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-green-700">
            🌿 GreenCare
          </h1>
          <p className="text-gray-500 mt-2">
            Your Smart Plant Companion
          </p>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center mb-6">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>

        {/* Name Field (only for register) */}
        {isRegister && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-3 rounded-lg mb-4 focus:ring-2 focus:ring-green-400 outline-none transition"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg mb-4 focus:ring-2 focus:ring-green-400 outline-none transition"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* Password */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-green-400 outline-none transition"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 text-sm"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition duration-300 ${
            loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading
            ? "Processing..."
            : isRegister
            ? "Register"
            : "Login"}
        </button>

        {/* Toggle Login/Register */}
        <p className="text-center text-gray-600 mt-6">
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-green-700 font-semibold ml-2 hover:underline"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>

      </div>
    </div>
  );
};

export default Login;