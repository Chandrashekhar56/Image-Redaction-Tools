import React from "react";
import { SlidersHorizontal, PaintBucket, Send } from "lucide-react";

export default function EffectBar({
  effectType,
  setEffectType,
  blurStrength,
  setBlurStrength,
  selections,
  imageSrc,
  setResultUrl,
  setMessage,
  isLoading,
  setIsLoading
}) {
  const applyEffect = () => {
    if (!imageSrc) {
      setMessage("Please upload an image first.");
      return;
    }
    if (selections.length === 0) {
      setMessage("Create at least one selection to apply the effect.");
      return;
    }

    setIsLoading(true);
    setMessage(`Applying ${effectType} effect...`);

    const originalImg = new Image();
    originalImg.crossOrigin = "anonymous";
    originalImg.src = imageSrc;

    originalImg.onload = () => {
      const imageWidth = originalImg.naturalWidth;
      const imageHeight = originalImg.naturalHeight;

      const resultCanvas = document.createElement("canvas");
      resultCanvas.width = imageWidth;
      resultCanvas.height = imageHeight;
      const ctx = resultCanvas.getContext("2d");

      ctx.drawImage(originalImg, 0, 0, imageWidth, imageHeight);

      selections.forEach((sel) => {
        ctx.save();
        ctx.beginPath();
        if (sel.type === "rectangle") {
          const { x, y, w, h } = sel.data;
          ctx.rect(x, y, w, h);
        } else if (sel.type === "circle") {
          const { cx, cy, r } = sel.data;
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
        } else if (sel.type === "lasso") {
          const pts = sel.data.points;
          if (pts.length > 1) {
            ctx.moveTo(pts[0][0], pts[0][1]);
            for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
            ctx.closePath();
          }
        }
        ctx.clip();

        if (effectType === "blur") {
          ctx.filter = `blur(${blurStrength}px)`;
          ctx.drawImage(originalImg, 0, 0, imageWidth, imageHeight);
        } else if (effectType === "redact") {
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, imageWidth, imageHeight);
        }
        ctx.restore();
      });

      const newUrl = resultCanvas.toDataURL("image/png");
      setResultUrl(newUrl);
      setMessage(`${effectType.charAt(0).toUpperCase() + effectType.slice(1)} effect applied successfully! Result is below.`);
      setIsLoading(false);
    };

    originalImg.onerror = () => {
      setMessage("Failed to load image for processing.");
      setIsLoading(false);
    };
  };

  const downloadResult = () => {
    if (!document) return;
    const img = document.querySelector('img[alt="processed-result"]');
    if (!img) return;
    const a = document.createElement("a");
    a.href = img.src;
    a.download = "redacted.png";
    a.click();
  };

  return (
    <div className="flex flex-wrap items-center justify-start gap-3 border-t pt-3 mt-1 bg-white p-4 rounded-xl shadow-md">
      <h3 className="font-semibold text-gray-700 text-sm mr-2">Effect:</h3>
      <button onClick={() => { setEffectType("blur"); setMessage("Effect set to blur."); }} className={`${effectType==="blur" ? "py-2 px-4 rounded-lg bg-fuchsia-600 text-white" : "py-2 px-4 rounded-lg bg-gray-200"} flex items-center space-x-2`}><SlidersHorizontal size={16}/> <span className="hidden sm:inline">Blur</span></button>
      <button onClick={() => { setEffectType("redact"); setMessage("Effect set to redact."); }} className={`${effectType==="redact" ? "py-2 px-4 rounded-lg bg-fuchsia-600 text-white" : "py-2 px-4 rounded-lg bg-gray-200"}  flex items-center space-x-2`}><PaintBucket size={16}/> <span className="hidden sm:inline">Redact</span></button>

      {effectType === "blur" && (
        <div className="flex items-center gap-2 pl-4">
          <label className="text-sm text-gray-600">Blur Strength ({blurStrength}px):</label>
          <input type="range" min="10" max="100" step="5" value={blurStrength} onChange={(e)=>setBlurStrength(parseInt(e.target.value))} />
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        <button onClick={applyEffect} disabled={isLoading} className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
          <Send size={16}/> Apply Effect
        </button>
        <button onClick={downloadResult} className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
          Download
        </button>
      </div>
    </div>
  );
}
