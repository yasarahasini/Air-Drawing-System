"use client";

import React, { useState } from "react";
import Camera from "@/components/Camera";

const HandTracking = () => {
  const [handData, setHandData] = useState<any>(null);

  return (
    <div>
      <h2>Hand Tracking</h2>

      <Camera onHandData={(data: any) => {
        console.log("HAND DATA:", data);
        setHandData(data);
      }} />

      {handData?.multiHandLandmarks && (
        <p style={{ color: "green" }}>✋ Hand Detected!</p>
      )}
    </div>
  );
};

export default HandTracking;