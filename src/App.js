import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import ToolBar from "./components/ToolBar";
import EffectBar from "./components/EffectBar";
import CanvasArea from "./components/CanvasArea";

function App() {
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [tool, setTool] = useState("rectangle");
  const [effectType, setEffectType] = useState("blur");
  const [blurStrength, setBlurStrength] = useState(50);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selections, setSelections] = useState([]);
  const [current, setCurrent] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Helmet>
        <title>SafeBlur - Free Image Redaction Tool (No Upload Required)</title>
        <meta
          name="description"
          content="Blur sensitive info from images securely — locally on your device. No uploads, no tracking, 100% privacy protected."
        />
        <meta
          name="keywords"
          content="blur image online, blur faces online, hide text in images, redact sensitive information, image redaction tool, privacy blur tool, censor screenshot, secure image editor, blur Aadhaar card details, remove personal information from image, online blur tool India, no upload blur tool, hide numbers in screenshot"
        />
        <meta
          property="og:title"
          content="SafeBlur - Free Image Redaction Tool"
        />
        <meta
          property="og:description"
          content="Hide sensitive details in images instantly — no upload required!"
        />
        <meta property="og:url" content="https://safeblur.netlify.app/" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          Image Redaction Tool
        </h1>
        <p className="text-gray-600 mb-6">
          SafeBlur helps you blur faces, text, Aadhaar numbers, bank details &
          personal information in images — all inside your browser. No upload.
          100% secure ✅
        </p>

        {message && (
          <div className="p-3 rounded-lg flex items-center text-sm mb-6">
            {message}
          </div>
        )}

        <ToolBar
          setFile={setFile}
          imageSrc={imageSrc}
          setImageSrc={setImageSrc}
          tool={tool}
          setTool={setTool}
          selections={selections}
          setSelections={setSelections}
          setMessage={setMessage}
          setResultUrl={setResultUrl}
        />

        <EffectBar
          effectType={effectType}
          setEffectType={setEffectType}
          blurStrength={blurStrength}
          setBlurStrength={setBlurStrength}
          selections={selections}
          imageSrc={imageSrc}
          setResultUrl={setResultUrl}
          setMessage={setMessage}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />

        <div className="grid md:grid-cols-2 gap-8 mt-6">
          <CanvasArea
            imageSrc={imageSrc}
            setImageSrc={setImageSrc}
            tool={tool}
            selections={selections}
            setSelections={setSelections}
            setMessage={setMessage}
          />

          <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              2. Result ({effectType.toUpperCase()})
            </h2>
            <div className="w-full max-w-full overflow-x-auto">
              {resultUrl ? (
                <img
                  src={resultUrl}
                  alt="processed-result"
                  className="w-full h-auto rounded-lg shadow-xl"
                />
              ) : (
                <div className="w-full aspect-video flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
                  <p>Click "Apply Effect" to see the result here.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} ZeroTrace. All rights reserved.
        </p>

        {/* ✅ ✅ SEO Landing Section (Bottom) ✅ ✅ */}
        <section className="mt-12 bg-white p-6 rounded-xl shadow-lg hidden">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Best Free Image Redaction & Blur Tool (India)
          </h2>
          <p className="text-gray-600 mb-4">
            SafeBlur allows you to hide personal and sensitive information on
            images securely. Everything happens on your device — nothing is
            uploaded to any server.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
            What Can You Blur?
          </h3>
          <ul className="list-disc list-inside text-gray-600">
            <li>Blur Aadhaar card details</li>
            <li>Hide WhatsApp chat screenshots</li>
            <li>Blur faces in photos</li>
            <li>Censor phone number & address in documents</li>
            <li>Remove personal bank details from images</li>
          </ul>
        </section>
      </div>
    </>
  );
}

export default App;
