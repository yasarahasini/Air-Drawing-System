"use client";

import Camera from "./components/camera";
import Canvas from "./components/canvas";
import { useState } from "react";

export default function Home() {
  const [drawData, setDrawData] = useState<any>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2>✋ Air Drawing System</h2>

      <div style={{ position: "relative" }}>
        <Camera onHandData={setDrawData} />
        <Canvas drawData={drawData} />
      </div>
    </div>
  );
}