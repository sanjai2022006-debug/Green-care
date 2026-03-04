import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Reminders from "./pages/Reminders";
import DetectDisease from "./pages/DetectDisease";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <Navbar />
              <Welcome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <Navbar />
              <Feed />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Navbar />
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reminders"
          element={
            <ProtectedRoute>
              <Navbar />
              <Reminders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/detect"
          element={
            <ProtectedRoute>
              <Navbar />
              <DetectDisease />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;