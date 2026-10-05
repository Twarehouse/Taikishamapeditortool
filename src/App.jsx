import React, { useState, useEffect } from "react";

import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Maps from "./pages/Maps";
import LoginForm from "./pages/LoginForm";
import Animation from "./pages/Animation";

import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import { LanguageProvider } from "./context/LanguageContext";

import { RosProvider } from "./context/ROSContext";

export default function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <LanguageProvider>
      <RosProvider>
        <Router>
          <Routes>

            <Route path="/login" element={<LoginForm />} />

            <Route path="/animation" element={<Animation />} />

            <Route path="/" element={<FirstVisitHandler />} />

            <Route
              path="/maps"
              element={
                <ProtectedRoute>
                  <DashboardLayout
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                  >
                    <Maps />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/maps" replace />} />

          </Routes>
        </Router>
      </RosProvider>
    </LanguageProvider>
  );
}

function FirstVisitHandler() {
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (loggedInUser) {
    return <Navigate to="/maps" replace />;
  }

  const hasSeenAnimation = sessionStorage.getItem("hasSeenAnimation");

  if (!hasSeenAnimation) {
    sessionStorage.setItem("hasSeenAnimation", "true");

    return <Navigate to="/animation" replace />;
  }

  return <Navigate to="/login" replace />;
}