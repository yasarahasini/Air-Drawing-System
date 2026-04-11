export function isHandOpen(landmarks: any) {
  // simple logic: index finger up check
  return landmarks[8].y < landmarks[6].y;
}