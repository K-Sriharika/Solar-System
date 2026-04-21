import { useEffect, useRef } from "react";
import { Hands, Results } from "@mediapipe/hands";
import * as handsUtils from "@mediapipe/hands";
import { useStore } from "../../store/useStore";
import * as THREE from "three";

export function HandTracker() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const setHandPosition = useStore((state) => state.setHandPosition);
  const setIsPinching = useStore((state) => state.setIsPinching);

  useEffect(() => {
    let hands: Hands | null = null;
    let cameraStream: MediaStream | null = null;

    async function setupHands() {
      const VERSION = "0.4.1675469240";
      hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${VERSION}/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      hands.onResults((results: Results) => {
        if (!results) return;
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const landmarks = results.multiHandLandmarks[0];
          
          const indexTip = landmarks[8];
          const thumbTip = landmarks[4];

          if (indexTip && thumbTip) {
            const x = (0.5 - indexTip.x) * 100;
            const y = (0.5 - indexTip.y) * 100;
            const z = (0.5 - indexTip.z) * 100;

            setHandPosition({ x, y, z });

            const distance = Math.sqrt(
              Math.pow(indexTip.x - thumbTip.x, 2) +
              Math.pow(indexTip.y - thumbTip.y, 2) +
              Math.pow(indexTip.z - thumbTip.z, 2)
            );

            setIsPinching(distance < 0.05);
          }
        } else {
          setHandPosition(null);
          setIsPinching(false);
        }
      });

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { 
              width: { ideal: 640 }, 
              height: { ideal: 480 },
              facingMode: 'user'
            },
          });

          if (videoRef.current) {
            videoRef.current.srcObject = cameraStream;
            
            // Wait for video to be ready
            await new Promise((resolve) => {
              if (videoRef.current) {
                videoRef.current.onloadedmetadata = () => {
                  videoRef.current?.play().then(resolve);
                };
              }
            });

            let isProcessing = true;
            const processVideo = async () => {
              if (!isProcessing) return;
              if (hands && videoRef.current && videoRef.current.readyState >= 3) { // HAVE_FUTURE_DATA or higher
                try {
                  await hands.send({ image: videoRef.current });
                } catch (err) {
                  console.error("MediaPipe send error:", err);
                }
              }
              if (isProcessing) {
                requestAnimationFrame(processVideo);
              }
            };
            processVideo();

            return () => {
              isProcessing = false;
            };
          }
        } catch (err) {
          console.error("Camera access denied or error:", err);
        }
      }
    }

    const cleanup = setupHands();

    return () => {
      hands?.close();
      cameraStream?.getTracks().forEach(track => track.stop());
      cleanup.then(fn => fn?.());
    };
  }, [setHandPosition, setIsPinching]);

  return (
    <video
      ref={videoRef}
      className="fixed bottom-4 right-4 w-48 h-36 rounded-lg border-2 border-white/20 scale-x-[-1] hidden" // Hidden but processing
      autoPlay
      muted
      playsInline
    />
  );
}
