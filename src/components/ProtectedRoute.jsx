import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) {
    // User not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }
  return children;
}


//--------- PROTECTED ROUTE FOR DB OF USER----------------//



// import React, { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children }) {
//   const [loading, setLoading] = useState(true);
//   const [authenticated, setAuthenticated] = useState(false);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await fetch("http://127.0.0.1:5001/api/auth/check", {
//           credentials: "include", // ✅ send cookies
//         });
//         setAuthenticated(res.ok);
//       } catch (err) {
//         console.error("Auth check failed:", err);
//         setAuthenticated(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
//   if (!authenticated) return <Navigate to="/login" replace />;

//   return children;
// }
