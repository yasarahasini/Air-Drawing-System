"use client";

import { useEffect, useRef } from "react";

export default function Canvas({ drawData }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<any>(null);

  let prevX = 0;
  let prevY = 0;

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.width = 640;
    canvas.height = 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 3;
    ctx.strokeStyle = "red";
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    if (!drawData) return;

    const landmarks = drawData.multiHandLandmarks;

    if (!landmarks || landmarks.length === 0) return;

    // index finger tip
    const finger = landmarks[0][8];

    const x = finger.x * 640;
    const y = finger.y * 480;

    const ctx = ctxRef.current;

    if (prevX === 0 && prevY === 0) {
      prevX = x;
      prevY = y;
      return;
    }

    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(x, y);
    ctx.stroke();

    prevX = x;
    prevY = y;
  }, [drawData]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        border: "2px solid black",
      }}
    />
  );
}