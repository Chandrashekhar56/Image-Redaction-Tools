import React from "react";
import { Move, Circle, Square, Minus, Trash2 } from "lucide-react";

export default function ToolBar({
  setFile,
  imageSrc,
  setImageSrc,
  tool,
  setTool,
  selections,
  setSelections,
  setMessage,
  setResultUrl,
}) {
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setImageSrc(url);
    setResultUrl(null);
    setSelections([]);
    setMessage("Image loaded successfully. Start drawing!");
  };

  const removeLast = () => {
    if (selections.length === 0) {
      setMessage("No selections to undo.");
      return;
    }
    setSelections((prev) => prev.slice(0, -1));
    setResultUrl(null);
    setMessage("Last selection undone.");
  };

  const clearSelections = () => {
    setSelections([]);
    setResultUrl(null);
    setMessage("All selections cleared.");
  };

  const ToolButton = ({ toolName, icon: Icon }) => (
    <button
      onClick={() => {
        setTool(toolName);
        setMessage(`Tool set to ${toolName}.`);
      }}
      className={`p-2 rounded-lg transition-all flex items-center justify-center gap-2 text-sm font-medium ${
        tool === toolName
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/50"
          : "bg-gray-200 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600"
      }`}
      title={`Select ${toolName} tool`}
    >
      <Icon size={20} />
      <span className="hidden sm:inline">
        {toolName.charAt(0).toUpperCase() + toolName.slice(1)}
      </span>
    </button>
  );

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-xl shadow-md mb-6">
      <div className="flex flex-wrap items-center justify-start gap-3">
        <label className="cursor-pointer bg-indigo-500 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200 text-sm">
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </label>

        {/* {imageSrc && ( */}
        <>
          <div className="h-6 border-l border-gray-300 mx-2 hidden sm:block"></div>
          <ToolButton toolName="rectangle" icon={Square} />
          <ToolButton toolName="circle" icon={Circle} />
          <ToolButton toolName="lasso" icon={Move} />

          <button
            onClick={removeLast}
            disabled={selections.length === 0}
            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 transition flex items-center text-sm gap-1"
            title="Undo Last Selection"
          >
            <Minus size={20} />
            <span className="hidden sm:inline">Undo</span>
          </button>
          <button
            onClick={clearSelections}
            disabled={selections.length === 0}
            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 transition flex items-center text-sm gap-1"
            title="Clear All Selections"
          >
            <Trash2 size={20} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </>
        {/* )} */}
      </div>
    </div>
  );
}
