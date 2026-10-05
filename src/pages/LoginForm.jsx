import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiCheckCircle } from "react-icons/fi";
import bgImage from "../assets/R&DAMR.png";

/* ================= HARDCODED CREDENTIALS ================= */
const HARDCODED_USER = {
  username: "admin",
  password: "admin123",
  orgName: "Taikisha India",
};

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");   // ✅ NEW success message

  const navigate = useNavigate();

  /* ========== Prevent Browser Back Button ========== */
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  /* ================= LOGIN HANDLER ================= */
  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please fill all the fields.");
      setSuccess("");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    setTimeout(() => {
      const inputUser = username.trim().toLowerCase();
      const inputPass = password.trim();

      if (
        inputUser === HARDCODED_USER.username.toLowerCase() &&
        inputPass === HARDCODED_USER.password
      ) {
        setSuccess("Login successful! Redirecting to dashboard...");
        
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem(
          "currentUser",
          JSON.stringify(HARDCODED_USER)
        );
        localStorage.setItem(
          "loggedInUser",
          HARDCODED_USER.orgName
        );

        // Redirect after showing success message
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);
      } else {
        setError("Invalid username or password!");
        setSuccess("");
      }

      setIsLoading(false);
    }, 800);
  };

  /* ================= UI ================= */
  return (
    <div
      className="flex items-center justify-center min-h-screen px-4 bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(2, 123, 189, 0.6), rgba(3, 105, 161, 0.6)), url(${bgImage})`,
      }}
    >
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10 w-full max-w-sm sm:max-w-md md:max-w-lg select-none">
        <h2 className="text-2xl sm:text-3xl font-bold text-sky-900 mb-6 text-center">
          Admin Login
        </h2>

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          
          {/* ✅ SUCCESS MESSAGE */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 text-green-700">
              <FiCheckCircle className="text-green-500 text-xl flex-shrink-0" />
              <span className="text-sm sm:text-base font-medium">{success}</span>
            </div>
          )}

          {/* ✅ ERROR MESSAGE */}
          {error && (
            <div className="text-red-600 text-sm sm:text-base font-medium text-left animate-shake bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
              setSuccess("");
            }}
            className="px-4 py-2 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
            disabled={isLoading || success}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
                setSuccess("");
              }}
              className="w-full px-4 py-2 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500 pr-10"
              disabled={isLoading || success}
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-gray-800"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading || success}
            className={`py-2 sm:py-3 rounded-md transition-colors text-sm sm:text-base font-medium ${
              success 
                ? "bg-green-600 text-white cursor-not-allowed" 
                : "bg-sky-700 text-white hover:bg-sky-800 disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            {isLoading ? "Logging in..." : success ? "Login Successful!" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FiEye, FiEyeOff } from "react-icons/fi";
// import bgImage from "../assets/R&DAMR.png";


// export default function LoginForm() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   // Prevent browser back button
//   useEffect(() => {
//     window.history.pushState(null, "", window.location.href);
//     const handlePopState = () => {
//       window.history.pushState(null, "", window.location.href);
//     };
//     window.addEventListener("popstate", handlePopState);
//     return () => window.removeEventListener("popstate", handlePopState);
//   }, []);

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!username || !password) {
//       alert("Please fill all the fields.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Try backend authentication first
//       const response = await fetch("http://localhost:5000/api/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           username: username.trim(),
//           password: password.trim(),
//         }),
//       });

//       const data = await response.json();

//       if (response.ok && data.success) {
//         // Store login status and user info
//         localStorage.setItem("isLoggedIn", "true");
//         localStorage.setItem("currentUser", JSON.stringify(data.user));
//         localStorage.setItem("authToken", data.token);
//         localStorage.setItem("loggedInUser", data.user.orgName);
        
//         alert("Login successful!");
//         navigate("/", { replace: true });
//         return;
//       }

//       // Fallback to localStorage check if backend fails
//       const savedUser = JSON.parse(localStorage.getItem("registeredUser") || "null");

//       if (!savedUser) {
//         alert("No registered account found! Please sign up first.");
//         navigate("/signup", { replace: true });
//         return;
//       }

//       if (
//         (username.trim().toLowerCase() === savedUser.orgName.toLowerCase() ||
//           username.trim().toLowerCase() === savedUser.contact.toLowerCase()) &&
//         password.trim() === savedUser.password
//       ) {
//         localStorage.setItem("isLoggedIn", "true");
//         localStorage.setItem("currentUser", JSON.stringify(savedUser));
//         localStorage.setItem("loggedInUser", savedUser.orgName);
//         navigate("/", { replace: true });
//       } else {
//         alert(data.message || "Invalid credentials! Please try again.");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       // Fallback to localStorage authentication
//       const savedUser = JSON.parse(localStorage.getItem("registeredUser") || "null");

//       if (!savedUser) {
//         alert("No registered account found! Please sign up first.");
//         navigate("/signup", { replace: true });
//         return;
//       }

//       if (
//         (username.trim().toLowerCase() === savedUser.orgName.toLowerCase() ||
//           username.trim().toLowerCase() === savedUser.contact.toLowerCase()) &&
//         password.trim() === savedUser.password
//       ) {
//         localStorage.setItem("isLoggedIn", "true");
//         localStorage.setItem("currentUser", JSON.stringify(savedUser));
//         localStorage.setItem("loggedInUser", savedUser.orgName);
//         navigate("/", { replace: true });
//       } else {
//         alert("Invalid credentials! Please try again.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
// <div
//   className="flex items-center justify-center min-h-screen px-4 bg-cover bg-center"
//   style={{
//     backgroundImage: `linear-gradient(rgba(2, 123, 189, 0.6), rgba(3, 105, 161, 0.6)), url(${bgImage})`,
//   }}
// >
//       <div className="bg-white rounded-xl shadow-lg p-6 sm:p-10 w-full max-w-sm sm:max-w-md md:max-w-lg backdrop-blur-sm select-none">
//         <h2 className="text-2xl sm:text-3xl font-bold text-sky-900 mb-6 text-center">
//           Login
//         </h2>

//         <form className="flex flex-col gap-4" onSubmit={handleLogin}>
//           <input
//             type="text"
//             placeholder="Organization Name or Email / Phone"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="px-4 py-2 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
//             required
//             disabled={isLoading}
//           />

//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-2 border rounded-md text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-sky-500 pr-10"
//               required
//               disabled={isLoading}
//             />
//             <span
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-gray-800"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FiEyeOff /> : <FiEye />}
//             </span>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="bg-sky-700 text-white py-2 sm:py-3 rounded-md hover:bg-sky-800 transition-colors text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isLoading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="text-xs sm:text-sm text-center text-gray-600 mt-4">
//           Don't have an account?{" "}
//           <span
//             className="text-sky-700 font-semibold hover:underline cursor-pointer"
//             onClick={() => navigate("/signup", { replace: true })}
//           >
//             Sign up
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }



//--------- LOGIN FOR DB OF USER----------------//


// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { FiDelete, FiLock, FiArrowRight, FiShield } from "react-icons/fi";
// import bgImage from "../assets/R&DAMR.png";

// export default function NumericKeypadLogin() {
//   const navigate = useNavigate();
  
//   // Hardcoded PIN - Change this to whatever PIN you want
//   const CORRECT_PIN = "123456"; // 6-digit PIN
  
//   const [pin, setPin] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [shake, setShake] = useState(false);
//   const PIN_LENGTH = 6;
  
//   // Create a ref for the PIN display
//   const pinDisplayRef = useRef(null);

//   // Focus on PIN display when component mounts
//   useEffect(() => {
//     if (pinDisplayRef.current) {
//       pinDisplayRef.current.focus();
//     }
//   }, []);

//   // Handle numeric keypad input
//   const handleNumberClick = (num) => {
//     if (pin.length < PIN_LENGTH) {
//       const newPin = pin + num;
//       setPin(newPin);
//       setError("");
//       setSuccess("");
      
//       // Auto-submit when PIN is complete
//       if (newPin.length === PIN_LENGTH) {
//         setTimeout(() => handleLogin(), 300);
//       }
//     }
//   };

//   // Handle backspace
//   const handleBackspace = () => {
//     if (pin.length > 0) {
//       setPin(pin.slice(0, -1));
//       setError("");
//     }
//   };

//   // Handle clear
//   const handleClear = () => {
//     setPin("");
//     setError("");
//     setSuccess("");
//   };

//   // Handle login
//   const handleLogin = () => {
//     if (pin.length !== PIN_LENGTH) {
//       setError(`Please enter ${PIN_LENGTH}-digit PIN`);
//       setShake(true);
//       setTimeout(() => setShake(false), 500);
//       return;
//     }

//     setIsLoading(true);
//     setError("");
//     setSuccess("");

//     // Simulate API call delay
//     setTimeout(() => {
//       // Check if PIN matches hardcoded value
//       if (pin === CORRECT_PIN) {
//         setSuccess("✓ PIN Verified! Logging in...");
        
//         // Success - redirect after short delay
//         setTimeout(() => {
//           navigate("/dashboard", { replace: true });
//         }, 1000);
//       } else {
//         setError("✗ Invalid PIN. Try again.");
//         setShake(true);
//         setTimeout(() => {
//           setPin("");
//           setShake(false);
//         }, 500);
//       }
//       setIsLoading(false);
//     }, 800);
//   };

//   // Handle Enter key press
//   const handleKeyPress = (e) => {
//     if (e.key >= '0' && e.key <= '9') {
//       handleNumberClick(e.key);
//     } else if (e.key === 'Enter') {
//       handleLogin();
//     } else if (e.key === 'Backspace') {
//       handleBackspace();
//     } else if (e.key === 'Escape') {
//       handleClear();
//     }
//   };

//   // Number buttons configuration
//   const numberButtons = [
//     { num: '1', label: '1' },
//     { num: '2', label: '2' },
//     { num: '3', label: '3' },
//     { num: '4', label: '4' },
//     { num: '5', label: '5' },
//     { num: '6', label: '6' },
//     { num: '7', label: '7' },
//     { num: '8', label: '8' },
//     { num: '9', label: '9' },
//     { num: '0', label: '0' },
//   ];

//   return (
//     <div
//       className="flex items-center justify-center min-h-screen px-4 bg-cover bg-center"
//       style={{
//         backgroundImage: `linear-gradient(rgba(2,123,189,0.6), rgba(3,105,161,0.6)), url(${bgImage})`,
//       }}
//     >
//       <div className="bg-white/95 rounded-2xl shadow-2xl p-6 sm:p-10 w-full max-w-md backdrop-blur-sm">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             <div className="bg-sky-100 p-3 rounded-full">
//               <FiShield className="text-sky-700 text-3xl" />
//             </div>
//           </div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-sky-900 mb-2">
//             Secure Access
//           </h1>
//           <p className="text-gray-600 text-sm">
//             Enter your {PIN_LENGTH}-digit security PIN
//           </p>
//           <p className="text-xs text-gray-500 mt-1">
//             Demo PIN: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{CORRECT_PIN}</span>
//           </p>
//         </div>

//         {/* PIN Display */}
//         <div 
//           ref={pinDisplayRef}
//           tabIndex={0}
//           onKeyDown={handleKeyPress}
//           className={`mb-8 p-6 bg-gray-50 rounded-xl border-2 ${error ? 'border-red-300' : success ? 'border-green-300' : 'border-gray-200'} ${shake ? 'animate-shake' : ''} focus:outline-none focus:border-sky-500`}
//         >
//           <div className="flex justify-center items-center mb-4">
//             <FiLock className="text-gray-400 mr-2" />
//             <span className="text-gray-600 font-medium">Security PIN</span>
//           </div>
          
//           {/* PIN Dots */}
//           <div className="flex justify-center space-x-4 mb-6">
//             {Array.from({ length: PIN_LENGTH }).map((_, index) => (
//               <div
//                 key={index}
//                 className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold ${
//                   index < pin.length
//                     ? 'bg-sky-600 text-white'
//                     : 'bg-gray-200 text-gray-400'
//                 }`}
//               >
//                 {index < pin.length ? '•' : ''}
//               </div>
//             ))}
//           </div>
          
//           {/* PIN Length Indicator */}
//           <div className="text-center">
//             <p className="text-sm text-gray-500">
//               {pin.length}/{PIN_LENGTH} digits
//             </p>
//           </div>
          
//           {/* Status Messages */}
//           {error && (
//             <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-center animate-fadeIn">
//               {error}
//             </div>
//           )}
          
//           {success && (
//             <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-center animate-fadeIn">
//               {success}
//             </div>
//           )}
          
//           {isLoading && (
//             <div className="mt-4 flex justify-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
//             </div>
//           )}
//         </div>

//         {/* Numeric Keypad */}
//         <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
//           {numberButtons.map((button) => (
//             <button
//               key={button.num}
//               type="button"
//               onClick={() => handleNumberClick(button.num)}
//               disabled={isLoading || pin.length === PIN_LENGTH}
//               className="aspect-square bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-xl text-2xl font-bold text-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm hover:shadow"
//             >
//               {button.label}
//             </button>
//           ))}
          
//           {/* Clear Button */}
//           <button
//             type="button"
//             onClick={handleClear}
//             disabled={isLoading || pin.length === 0}
//             className="aspect-square bg-red-50 hover:bg-red-100 active:bg-red-200 rounded-xl text-lg font-medium text-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm hover:shadow"
//           >
//             Clear
//           </button>
          
//           {/* Backspace Button */}
//           <button
//             type="button"
//             onClick={handleBackspace}
//             disabled={isLoading || pin.length === 0}
//             className="aspect-square bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-xl text-lg font-medium text-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm hover:shadow"
//           >
//             <FiDelete className="text-xl" />
//           </button>
          
//           {/* Enter/Submit Button */}
//           <button
//             type="button"
//             onClick={handleLogin}
//             disabled={isLoading || pin.length === 0}
//             className={`aspect-square rounded-xl text-lg font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm hover:shadow ${
//               pin.length === PIN_LENGTH 
//                 ? 'bg-green-600 hover:bg-green-700 active:bg-green-800' 
//                 : 'bg-sky-600 hover:bg-sky-700 active:bg-sky-800'
//             }`}
//           >
//             {pin.length === PIN_LENGTH ? (
//               <FiArrowRight className="text-xl" />
//             ) : (
//               "Enter"
//             )}
//           </button>
//         </div>

//         {/* Instructions */}
//         <div className="text-center text-xs text-gray-500 space-y-1">
//           <p>• Press numbers or use keyboard (0-9)</p>
//           <p>• Press <kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd> to submit</p>
//           <p>• Press <kbd className="px-2 py-1 bg-gray-100 rounded">Backspace</kbd> to delete</p>
//           <p>• Press <kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd> to clear</p>
//         </div>

//         {/* Demo Info */}
//         <div className="mt-8 p-3 bg-blue-50 rounded-lg text-center">
//           <p className="text-sm text-blue-700">
//             <strong>Demo Mode:</strong> Enter <code className="bg-white px-2 py-1 rounded">{CORRECT_PIN}</code> to login
//           </p>
//         </div>
//       </div>

//       {/* Add custom animations to global CSS */}
//       <style jsx>{`
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
//           20%, 40%, 60%, 80% { transform: translateX(5px); }
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         .animate-shake {
//           animation: shake 0.5s ease-in-out;
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-in-out;
//         }
//       `}</style>
//     </div>
//   );
// }