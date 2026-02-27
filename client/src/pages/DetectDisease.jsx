import React, { useRef, useState, useEffect } from "react";
import * as tmImage from "@teachablemachine/image";

/* 🔥 IMPORTANT: Renamed to avoid conflict with browser URL */
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/aCMqiCuHD/";

/* ================= REMEDIES ================= */

const remedies = {
  "Bacterial Spot": {
    home: "Remove infected leaves. Improve airflow. Spray neem oil weekly.",
    chemical: "Apply Copper bactericide every 7–10 days.",
  },
  "Leaf Spot": {
    home: "Remove infected leaves. Avoid overhead watering.",
    chemical: "Use Copper fungicide or Chlorothalonil.",
  },
  "Early blight": {
    home: "Prune affected leaves. Improve spacing.",
    chemical: "Spray Mancozeb fungicide.",
  },
  "Late blight": {
    home: "Remove infected leaves immediately.",
    chemical: "Apply Copper fungicide.",
  },
  "healthy": {
    home: "Your plant is healthy 🌿 Maintain watering and sunlight.",
    chemical: "No treatment required.",
  },
};

export default function DetectDisease() {
  const imageRef = useRef(null);
  const [model, setModel] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD MODEL ================= */

  useEffect(() => {
    const loadModel = async () => {
      try {
        const modelURL = MODEL_URL + "model.json";
        const metadataURL = MODEL_URL + "metadata.json";
        const loadedModel = await tmImage.load(modelURL, metadataURL);
        setModel(loadedModel);
      } catch (err) {
        console.error("Model loading error:", err);
      }
    };
    loadModel();
  }, []);

  /* ================= IMAGE UPLOAD ================= */

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageURL = window.URL.createObjectURL(file); // ✅ FIXED
    setPreview(imageURL);
    setResult(null);
  };

  /* ================= DETECT ================= */

  const handleDetect = async () => {
    if (!model || !imageRef.current) return;

    setLoading(true);

    const prediction = await model.predict(imageRef.current);

    let highest = prediction[0];
    for (let i = 1; i < prediction.length; i++) {
      if (prediction[i].probability > highest.probability) {
        highest = prediction[i];
      }
    }

    const confidence = (highest.probability * 100).toFixed(2);

    const severity =
      confidence > 85
        ? "High"
        : confidence > 60
        ? "Medium"
        : "Low";

    const remedyData = remedies[highest.className] || {
      home: "Remedy not available for this disease.",
      chemical: "Remedy not available for this disease.",
    };

    setResult({
      disease: highest.className,
      confidence,
      severity,
      home: remedyData.home,
      chemical: remedyData.chemical,
    });

    setLoading(false);
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-green-100 to-green-300 p-6">
      <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 w-full max-w-2xl">

        <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
          🌿 Smart Plant Disease Detector
        </h1>

        {/* Upload Box */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-green-400 rounded-2xl p-8 cursor-pointer hover:bg-green-50 transition">
          <span className="text-gray-600">
            Click to upload plant image
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        {/* Image Preview */}
        {preview && (
          <img
            ref={imageRef}
            src={preview}
            alt="preview"
            className="mt-6 w-full h-72 object-cover rounded-2xl shadow-lg"
          />
        )}

        {/* Detect Button */}
        <button
          onClick={handleDetect}
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-2xl font-semibold text-lg hover:bg-green-700 transition shadow-lg"
        >
          Detect Disease
        </button>

        {/* Loading */}
        {loading && (
          <p className="mt-4 text-center text-gray-700 animate-pulse">
            🔍 Analyzing...
          </p>
        )}

        {/* Result */}
        {result && (
          <div className="mt-8 bg-white rounded-2xl shadow p-6">

            <h2 className="text-xl font-bold text-green-800">
              🌱 {result.disease}
            </h2>

            <p className="mt-2">
              📊 Confidence: <strong>{result.confidence}%</strong>
            </p>

            <p className="mt-2">
              ⚠ Severity:
              <span className={`ml-2 font-bold ${
                result.severity === "High"
                  ? "text-red-600"
                  : result.severity === "Medium"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}>
                {result.severity}
              </span>
            </p>

            <div className="mt-6 bg-green-50 p-4 rounded-xl">
              <h3 className="font-semibold text-green-700">
                🏡 Home Remedy
              </h3>
              <p className="text-gray-700 mt-2">
                {result.home}
              </p>
            </div>

            <div className="mt-4 bg-green-50 p-4 rounded-xl">
              <h3 className="font-semibold text-green-700">
                🧪 Chemical Remedy
              </h3>
              <p className="text-gray-700 mt-2">
                {result.chemical}
              </p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}