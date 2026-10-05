import React, { useEffect, useRef } from "react";
import { Joystick } from "react-joystick-component";

const MAX_LINEAR = 0.2;
const MAX_ANGULAR = 1.0;

const JoystickControl = () => {
  const wsRef = useRef(null);

  useEffect(() => {
const ws = new WebSocket("ws://" + window.location.hostname + ":8765");

    ws.onopen = () => console.log("✅ Connected to Python WebSocket");
    ws.onerror = (err) => console.error("❌ WebSocket error:", err);
    ws.onclose = () => console.log("⚠️ WebSocket closed");

    wsRef.current = ws;

    return () => ws.close();
  }, []);

  const sendVelocity = (linear, angular) => {
    if (!wsRef.current || wsRef.current.readyState !== 1) return;

    wsRef.current.send(
      JSON.stringify({
        x: angular / MAX_ANGULAR,
        y: linear / MAX_LINEAR,
      })
    );
  };

  const handleMove = (event) => {
    const linear = event.y * MAX_LINEAR;
    const angular = -event.x * MAX_ANGULAR;
    sendVelocity(linear, angular);
  };

  const handleStop = () => {
    sendVelocity(0, 0);
  };

  return (
<div className="flex justify-center items-center w-96 h-96  rounded-2xl shadow-lg">
      <Joystick
        throttle={80}
        size={160}
        stickSize={70}
        baseColor="#F3F4F6"
        stickColor="#0284c7"
        move={handleMove}
        stop={handleStop}
      />
    </div>
  );
};

export default JoystickControl;
