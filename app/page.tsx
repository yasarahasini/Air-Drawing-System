"use client";

import React, { useRef, useState } from "react";
import Camera from "./components/camera";
import Canvas from "./components/canvas";

export default function Home() {
  const handDataRef = useRef<any>(null);
  const [color, setColor] = useState("red");

  return (
    <div>
      <h2>🎨 Air Draw System</h2>

      {/* 🎨 Color Picker */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setColor("red")}>🔴</button>
        <button onClick={() => setColor("blue")}>🔵</button>
        <button onClick={() => setColor("green")}>🟢</button>
        <button onClick={() => setColor("black")}>⚫</button>
      </div>

      <Camera
        onHandData={(data: any) => {
          handDataRef.current = data;
        }}
      />

      <Canvas
        getHandData={() => handDataRef.current}
        color={color}
      />
    </div>
  );
}