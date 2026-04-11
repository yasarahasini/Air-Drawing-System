"use client";

import { useEffect, useRef } from "react";

export default function CameraFeed({ onHandData }: any) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let hands: any;

    const loadScript = (src: string) => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        document.body.appendChild(script);
      });
    };

    const init = async () => {
      // ✅ Load MediaPipe scripts from CDN
      await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");
      await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js");

      const HandsClass = (window as any).Hands;

      if (!HandsClass) {
        console.error("Hands not loaded");
        return;
      }

      hands = new HandsClass({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      });

      hands.onResults((results: any) => {
        onHandData(results);
      });

      const video = videoRef.current;
      if (!video) return;

      // ✅ Start webcam
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      video.srcObject = stream;
      await video.play();

      // 🔁 detection loop
      const detect = async () => {
        if (!video || !hands) return;

        await hands.send({ image: video });
        requestAnimationFrame(detect);
      };

      detect();
    };

    init();
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      style={{
        width: 640,
        height: 480,
        position: "absolute",
        top: 0,
        left: 0,
        opacity: 0.3,
      }}
    />
  );
}