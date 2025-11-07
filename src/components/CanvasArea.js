import React, { useRef, useState, useEffect, useCallback } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

export default function CanvasArea({
  imageSrc,
  tool,
  selections,
  setSelections,
  setMessage,
}) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [current, setCurrent] = useState(null);

  const getCanvasContext = () => canvasRef.current?.getContext("2d");

  const getCoords = useCallback((clientX, clientY) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    return [
      Math.round((clientX - rect.left) * scaleX),
      Math.round((clientY - rect.top) * scaleY),
    ];
  }, []);

  const redraw = useCallback(() => {
    const ctx = getCanvasContext();
    const img = imgRef.current;
    if (!ctx || !img || !imageSrc) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.lineWidth = 3;
    ctx.setLineDash([]);

    selections.forEach((sel) => {
      ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
      ctx.beginPath();
      if (sel.type === "rectangle") {
        const { x, y, w, h } = sel.data;
        ctx.rect(x, y, w, h);
      } else if (sel.type === "circle") {
        const { cx, cy, r } = sel.data;
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
      } else if (sel.type === "lasso") {
        const pts = sel.data.points;
        ctx.moveTo(pts[0][0], pts[0][1]);
        pts.forEach(([px, py]) => ctx.lineTo(px, py));
        ctx.closePath();
      }
      ctx.stroke();
    });

    if (current) {
      ctx.strokeStyle = "rgba(0, 80, 255, 0.9)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);

      ctx.beginPath();
      if (current.type === "rectangle") {
        const { x, y, w, h } = current.data;
        ctx.rect(x, y, w, h);
      } else if (current.type === "circle") {
        const { cx, cy, r } = current.data;
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
      } else if (current.type === "lasso") {
        const pts = current.data.points;
        ctx.moveTo(pts[0][0], pts[0][1]);
        pts.forEach(([px, py]) => ctx.lineTo(px, py));
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [imageSrc, selections, current]);

  useEffect(() => redraw(), [selections, current, redraw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!img) return;

    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      redraw();
    };
  }, [imageSrc]);

  const start = (x, y) => {
    if (!imageSrc) {
      setMessage("Please upload an image first.");
      return;
    }
    setIsDrawing(true);

    if (tool === "rectangle") {
      setCurrent({ type: "rectangle", data: { x, y, w: 0, h: 0 } });
    } else if (tool === "circle") {
      setCurrent({ type: "circle", data: { cx: x, cy: y, r: 0 } });
    } else if (tool === "lasso") {
      setCurrent({ type: "lasso", data: { points: [[x, y]] } });
    }
  };

  const move = (x, y) => {
    if (!isDrawing || !current) return;

    const updated = { ...current };
    const data = updated.data;

    if (current.type === "rectangle") {
      updated.data = { x: data.x, y: data.y, w: x - data.x, h: y - data.y };
    } else if (current.type === "circle") {
      const dx = x - data.cx;
      const dy = y - data.cy;
      updated.data = {
        cx: data.cx,
        cy: data.cy,
        r: Math.sqrt(dx * dx + dy * dy),
      };
    } else if (current.type === "lasso") {
      const last = data.points[data.points.length - 1];
      if (Math.hypot(x - last[0], y - last[1]) > 3) {
        updated.data = { points: [...data.points, [x, y]] };
      }
    }
    setCurrent(updated);
  };

  const end = () => {
    if (!isDrawing || !current) return;
    setIsDrawing(false);

    let sel = null;
    const d = current.data;

    if (
      current.type === "rectangle" &&
      Math.abs(d.w) > 10 &&
      Math.abs(d.h) > 10
    ) {
      const x = d.w < 0 ? d.x + d.w : d.x;
      const y = d.h < 0 ? d.y + d.h : d.y;
      sel = {
        id: crypto.randomUUID(),
        type: "rectangle",
        data: { x, y, w: Math.abs(d.w), h: Math.abs(d.h) },
      };
    }
    if (current.type === "circle" && d.r > 10) {
      sel = { id: crypto.randomUUID(), type: "circle", data: d };
    }
    if (current.type === "lasso" && d.points.length > 10) {
      sel = { id: crypto.randomUUID(), type: "lasso", data: d };
    }

    if (sel) {
      setSelections((prev) => [...prev, sel]);
      setMessage(`Selection added (${sel.type}) ✅`);
    }

    setCurrent(null);
  };

  const touchHandler = (handler) => (e) => {
    e.preventDefault();
    const t = e.touches[0] || e.changedTouches[0];
    const [x, y] = getCoords(t.clientX, t.clientY);
    handler(x, y);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-3 text-gray-800">
        1. Draw on Image
      </h2>

      <div className="w-full max-w-full overflow-x-auto">
        {imageSrc ? (
          <canvas
            ref={canvasRef}
            onMouseDown={(e) => start(...getCoords(e.clientX, e.clientY))}
            onMouseMove={(e) => move(...getCoords(e.clientX, e.clientY))}
            onMouseUp={end}
            onMouseLeave={end}
            onTouchStart={touchHandler(start)}
            onTouchMove={touchHandler(move)}
            onTouchEnd={end}
            className={`cursor-crosshair border-4 rounded-lg transition-shadow ${
              isDrawing
                ? "shadow-lg border-indigo-500"
                : "shadow-md border-gray-300"
            }`}
            style={{ maxWidth: "100%", height: "auto", touchAction: "none" }}
          />
        ) : (
          <div className="w-full aspect-video flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
            Please upload an image to begin.
          </div>
        )}
      </div>

      <img ref={imgRef} src={imageSrc} alt="" hidden />

      <div className="mt-3 text-sm text-gray-500">
        Current Tool:{" "}
        <span className="font-semibold text-gray-700">
          {tool.charAt(0).toUpperCase() + tool.slice(1)}
        </span>{" "}
        | Total Selections:{" "}
        <span className="font-semibold text-gray-700">{selections.length}</span>
      </div>
    </div>
  );
}
