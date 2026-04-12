"use client";

import { useEffect, useRef } from "react";

export default function Canvas({ getHandData, color }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<any>(null);

  const prevX = useRef(0);
  const prevY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.width = 640;
    canvas.height = 480;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
    }
  }, [color]);

  useEffect(() => {
    let animationId: any;

    const draw = () => {
      const drawData = getHandData();

      if (drawData) {
        const landmarks = drawData.multiHandLandmarks;

        if (!landmarks || landmarks.length === 0) {
          prevX.current = 0;
          prevY.current = 0;
        } else {
          const hand = landmarks[0];

          const indexTip = hand[8];
          const indexBase = hand[6];
          const middleTip = hand[12];
          const middleBase = hand[10];

          const isIndexUp = indexTip.y < indexBase.y;
          const isMiddleUp = middleTip.y < middleBase.y;

          const x = indexTip.x * 640;
          const y = indexTip.y * 480;

          const ctx = ctxRef.current;

          // ✌️ ERASER
          if (isIndexUp && isMiddleUp) {
            ctx.strokeStyle = "white";
          }
         
          else if (isIndexUp) {
            ctx.strokeStyle = color;
          } else {
            prevX.current = 0;
            prevY.current = 0;
            animationId = requestAnimationFrame(draw);
            return;
          }

          if (prevX.current === 0 && prevY.current === 0) {
            prevX.current = x;
            prevY.current = y;
          } else {
            const smooth = 0.7;

            const newX = smooth * prevX.current + (1 - smooth) * x;
            const newY = smooth * prevY.current + (1 - smooth) * y;

            ctx.beginPath();
            ctx.moveTo(prevX.current, prevY.current);
            ctx.lineTo(newX, newY);
            ctx.stroke();

            prevX.current = newX;
            prevY.current = newY;
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [color]);

  const clearCanvas = () => {
    const canvas = canvasRef.current!;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveImage = () => {
    const canvas = canvasRef.current!;
    const link = document.createElement("a");
    link.download = "air-draw.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          border: "2px solid black",
        }}
      />

      <div style={{ position: "absolute", top: 500 }}>
        <button onClick={clearCanvas}>🧽 Clear</button>
        <button onClick={saveImage}>💾 Save</button>
      </div>
    </>
  );
}