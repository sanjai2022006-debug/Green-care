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

    if (!form.email || !form.password || (isRegister && !form.name)) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      let res;

      if (isRegister) {
        // Register
        await api.post("/auth/register", {
          name: form.name,
          email: form.email,
          password: form.password,
        });

        // Auto login after register
        res = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });

      } else {
        // Login
        res = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/welcome");

    } catch (err) {
      console.error("Auth Error:", err);
      setError(
        err.response?.data?.message ||
        "Invalid credentials or server error."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-200 to-green-400">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md">
        
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-green-700">
            🌿 GreenCare
          </h1>
          <p className="text-gray-500 mt-2">
            Your Smart Plant Companion
          </p>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-6">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>

        {isRegister && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-3 rounded-lg mb-4"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg mb-4"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border p-3 rounded-lg"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-sm text-gray-600"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition"
        >
          {loading
            ? "Processing..."
            : isRegister
            ? "Register"
            : "Login"}
        </button>

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