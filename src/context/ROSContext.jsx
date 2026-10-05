// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
//   useCallback,
// } from "react";

// const ROSContext = createContext(null);

// export function RosProvider({ children }) {

//   const rosRef = useRef(null);

//   const [connected, setConnected] = useState(false);

//   const connectROS = useCallback(() => {

//     if (!window.ROSLIB) {
//       console.error("[ROS] ROSLIB missing");
//       return;
//     }

//     // already connected
//     if (rosRef.current) {
//       console.log("[ROS] Already connected");
//       return;
//     }

//     const ip =
//       localStorage.getItem("rosIP") || "127.0.0.1";

//     const port =
//       localStorage.getItem("rosPort") || "9090";

//     console.log(`[ROS] Connecting → ws://${ip}:${port}`);

//     const ros = new window.ROSLIB.Ros({
//       url: `ws://${ip}:${port}`,
//     });

//     ros.on("connection", () => {
//       console.log("[ROS] ✓ Connected");

//       rosRef.current = ros;

//       setConnected(true);
//     });

//     ros.on("error", (err) => {
//       console.error("[ROS] Connection Error:", err);

//       setConnected(false);
//     });

//     ros.on("close", () => {
//       console.log("[ROS] Connection Closed");

//       rosRef.current = null;

//       setConnected(false);
//     });

//   }, []);

//   useEffect(() => {

//     const waitForROSLIB = () => {

//       if (window.ROSLIB) {
//         console.log("[ROS] window.ROSLIB ready ✓");

//         connectROS();

//         return;
//       }

//       setTimeout(waitForROSLIB, 300);
//     };

//     waitForROSLIB();

//     return () => {
//       if (rosRef.current) {
//         rosRef.current.close();
//       }
//     };

//   }, [connectROS]);

//   const subscribe = useCallback(
//     (name, messageType, callback) => {

//       if (!rosRef.current) {
//         console.warn("[ROS] Not connected");
//         return;
//       }

//       const topic = new window.ROSLIB.Topic({
//         ros: rosRef.current,
//         name,
//         messageType,
//       });

//       topic.subscribe(callback);

//       return () => topic.unsubscribe();
//     },
//     []
//   );

//   return (
//     <ROSContext.Provider
//       value={{
//         connected,
//         ros: rosRef.current,
//         subscribe,
//       }}
//     >
//       {children}
//     </ROSContext.Provider>
//   );
// }

// export const useROS = () => {
//   return useContext(ROSContext);
// };

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

const ROSContext = createContext(null);

export function RosProvider({ children }) {
  const rosRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const reconnectTimeoutRef = useRef(null);
  const isConnectingRef = useRef(false);

  const connectROS = useCallback(() => {
    // Prevent multiple simultaneous connection attempts
    if (isConnectingRef.current) {
      console.log("[ROS] Already connecting, skipping...");
      return;
    }

    if (!window.ROSLIB) {
      console.error("[ROS] ROSLIB missing - make sure roslib.js is loaded");
      setError("ROSLIB library not loaded");
      return;
    }

    // Close existing connection if any
    if (rosRef.current) {
      try {
        rosRef.current.close();
      } catch (e) {
        console.error("[ROS] Error closing existing connection:", e);
      }
      rosRef.current = null;
    }

    // Get IP and port from localStorage or use defaults
    const ip = localStorage.getItem("rosIP") || "127.0.0.1";
    const port = localStorage.getItem("rosPort") || "9090";

    const wsUrl = `ws://${ip}:${port}`;
    console.log(`[ROS] Connecting to ${wsUrl}`);

    isConnectingRef.current = true;

    try {
      const ros = new window.ROSLIB.Ros({
        url: wsUrl,
        encoding: 'binary',
      });

      ros.on("connection", () => {
        console.log("[ROS] ✓ Connected successfully to", wsUrl);
        setConnected(true);
        setError(null);
        isConnectingRef.current = false;
        
        // Clear any pending reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      });

      ros.on("error", (err) => {
        console.error("[ROS] Connection Error:", err);
        setConnected(false);
        setError(err.message || "Connection error");
        isConnectingRef.current = false;
      });

      ros.on("close", () => {
        console.log("[ROS] Connection closed");
        setConnected(false);
        
        // Only attempt reconnect if we had a connection before or we're not manually closing
        if (rosRef.current) {
          rosRef.current = null;
          
          // Attempt to reconnect after 5 seconds
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("[ROS] Attempting automatic reconnect...");
            isConnectingRef.current = false;
            connectROS();
          }, 5000);
        }
        
        isConnectingRef.current = false;
      });

      rosRef.current = ros;
    } catch (err) {
      console.error("[ROS] Failed to create ROS connection:", err);
      setError(err.message);
      setConnected(false);
      isConnectingRef.current = false;
    }
  }, []);

  // Initial connection only - no dependencies that change
  useEffect(() => {
    const waitForROSLIB = () => {
      if (window.ROSLIB) {
        console.log("[ROS] window.ROSLIB ready ✓");
        connectROS();
        return;
      }
      console.log("[ROS] Waiting for ROSLIB...");
      setTimeout(waitForROSLIB, 300);
    };

    waitForROSLIB();

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (rosRef.current) {
        console.log("[ROS] Cleaning up connection");
        try {
          rosRef.current.close();
        } catch (e) {
          console.error("[ROS] Error during cleanup:", e);
        }
        rosRef.current = null;
      }
    };
  }, [connectROS]);

  const subscribe = useCallback((name, messageType, callback) => {
    if (!rosRef.current || !connected) {
      console.warn("[ROS] Not connected, cannot subscribe to", name);
      return null;
    }

    try {
      const topic = new window.ROSLIB.Topic({
        ros: rosRef.current,
        name,
        messageType,
        queue_size: 10,
        throttle_rate: 100,
      });

      topic.subscribe(callback);
      console.log(`[ROS] Subscribed to ${name}`);

      return () => {
        console.log(`[ROS] Unsubscribing from ${name}`);
        topic.unsubscribe();
      };
    } catch (err) {
      console.error(`[ROS] Error subscribing to ${name}:`, err);
      return null;
    }
  }, [connected]);

  // Helper function to manually reconnect
  const reconnect = useCallback(() => {
    console.log("[ROS] Manual reconnect requested");
    
    // Clear any pending reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    // Close existing connection if any
    if (rosRef.current) {
      try {
        rosRef.current.close();
      } catch (e) {
        console.error("[ROS] Error closing connection:", e);
      }
      rosRef.current = null;
    }
    
    setConnected(false);
    isConnectingRef.current = false;
    
    // Small delay before reconnecting
    setTimeout(() => {
      connectROS();
    }, 100);
  }, [connectROS]);

  // Helper function to set ROS master address
  const setRosMaster = useCallback((ip, port) => {
    localStorage.setItem("rosIP", ip);
    localStorage.setItem("rosPort", port || "9090");
    console.log(`[ROS] ROS master address set to ${ip}:${port || 9090}`);
    reconnect();
  }, [reconnect]);

  const value = {
    connected,
    ros: rosRef.current,
    subscribe,
    reconnect,
    setRosMaster,
    error,
  };

  return React.createElement(ROSContext.Provider, { value }, children);
}

// Make sure useROS is exported as a named export
export const useROS = () => {
  const context = useContext(ROSContext);
  if (!context) {
    throw new Error("useROS must be used within a RosProvider");
  }
  return context;
};

// Also export as default for flexibility
export default ROSContext;