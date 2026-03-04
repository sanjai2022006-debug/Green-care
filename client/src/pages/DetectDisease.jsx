import React, { useEffect, useState, useCallback } from "react";
import * as tmImage from "@teachablemachine/image";

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/KwISPyTop/";

const remedies = {

  "Mosaic Virus": {
    home: [
      "Remove infected plants immediately to stop spread.",
      "Control insects like aphids which transmit viruses.",
      "Disinfect gardening tools after use.",
      "Maintain proper plant spacing for airflow.",
      "Use resistant plant varieties if available."
    ],
    chemical:
      "There is no direct chemical cure for mosaic virus. Control insect vectors using insecticides such as Imidacloprid or neem-based insecticides."
  },

  "Leaf Spot": {
    home: [
      "Spray neem oil every 5 days.",
      "Apply baking soda spray solution.",
      "Remove infected leaves immediately.",
      "Improve airflow around plants.",
      "Avoid watering plant leaves directly."
    ],
    chemical:
      "Apply copper fungicide or chlorothalonil spray every 7–10 days following label instructions."
  },

  "Early Blight": {
    home: [
      "Remove infected leaves quickly.",
      "Use garlic extract spray weekly.",
      "Apply neem oil spray weekly.",
      "Mulch soil around plants.",
      "Ensure plants receive proper sunlight."
    ],
    chemical:
      "Use Mancozeb or Chlorothalonil fungicide weekly until infection reduces."
  },

  "Late Blight": {
    home: [
      "Remove infected plant parts immediately.",
      "Spray diluted milk solution weekly.",
      "Avoid overhead watering.",
      "Improve ventilation around plants.",
      "Use compost tea spray."
    ],
    chemical:
      "Apply metalaxyl-based fungicide or copper fungicide spray every 7–10 days."
  },

  "Bacterial Spot": {
    home: [
      "Remove infected leaves immediately.",
      "Spray neem oil weekly.",
      "Avoid overhead watering.",
      "Disinfect gardening tools.",
      "Use diluted hydrogen peroxide spray."
    ],
    chemical:
      "Apply copper-based bactericide spray every 7–10 days."
  }

};

export default function DetectDisease() {

  const [model, setModel] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [imageElement, setImageElement] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadModel = useCallback(async () => {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";
    const loadedModel = await tmImage.load(modelURL, metadataURL);
    setModel(loadedModel);
  }, []);

  useEffect(() => {
    loadModel();
  }, [loadModel]);

  const handleImageUpload = (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImageURL(url);

    const img = new Image();
    img.src = url;
    img.onload = () => setImageElement(img);

    setPrediction(null);
    setConfidence(null);
  };

  const detectDisease = async () => {

    if (!model || !imageElement) {
      alert("Upload image first");
      return;
    }

    setLoading(true);

    const predictions = await model.predict(imageElement);

    let best = predictions[0];

    predictions.forEach(p => {
      if (p.probability > best.probability) best = p;
    });

    setPrediction(best.className);
    setConfidence((best.probability * 100).toFixed(2));

    setLoading(false);
  };

  const resetDetection = () => {
    setImageURL(null);
    setPrediction(null);
    setConfidence(null);
    setImageElement(null);
  };

  return (

    <div style={styles.page}>

      <h1 style={styles.title}>🌿 Plant Disease Detection</h1>

      <div style={styles.container}>

        {/* LEFT PANEL */}

        <div style={styles.left}>

          <label style={styles.uploadBtn}>
            📷 Choose Plant Image
            <input type="file" hidden onChange={handleImageUpload}/>
          </label>

          {imageURL && (
            <img src={imageURL} alt="preview" style={styles.preview}/>
          )}

          <button style={styles.detectBtn} onClick={detectDisease}>
            🔍 Detect Disease
          </button>

          {loading && <p>Analyzing image...</p>}

        </div>

        {/* RIGHT PANEL */}

        <div style={styles.right}>

          {!prediction && (
            <p style={{color:"#555"}}>
              Upload an image to see disease detection results.
            </p>
          )}

          {prediction && (

            <div>

              <h2 style={styles.disease}>
                Detected: {prediction}
              </h2>

              <p>Confidence: {confidence}%</p>

              {remedies[prediction] && (

                <>

                  {/* HOME REMEDIES */}

                  <div style={styles.card}>

                    <h3>🏡 Home Remedies</h3>

                    <ul>
                      {remedies[prediction].home.map((r,i)=>(
                        <li key={i}>{r}</li>
                      ))}
                    </ul>

                  </div>

                  {/* CHEMICAL */}

                  <div style={styles.card}>

                    <h3>🧪 Chemical Treatment</h3>

                    <p>{remedies[prediction].chemical}</p>

                  </div>

                </>

              )}

              <button style={styles.doneBtn} onClick={resetDetection}>
                ✔ OK / Done
              </button>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

const styles = {

  page:{
    minHeight:"100vh",
    background:"linear-gradient(135deg,#d1fae5,#bbf7d0)",
    padding:"40px"
  },

  title:{
    textAlign:"center",
    color:"#065f46",
    marginBottom:"30px"
  },

  container:{
    display:"flex",
    gap:"40px",
    background:"white",
    padding:"30px",
    borderRadius:"12px",
    width:"1000px",
    margin:"auto",
    boxShadow:"0 10px 25px rgba(0,0,0,0.15)"
  },

  left:{flex:1,textAlign:"center"},
  right:{flex:1},

  uploadBtn:{
    background:"#16a34a",
    color:"white",
    padding:"12px",
    borderRadius:"8px",
    cursor:"pointer",
    display:"block",
    marginBottom:"20px"
  },

  preview:{
    width:"100%",
    borderRadius:"10px",
    marginBottom:"20px"
  },

  detectBtn:{
    width:"100%",
    padding:"12px",
    background:"#15803d",
    border:"none",
    color:"white",
    borderRadius:"8px",
    cursor:"pointer",
    fontSize:"16px"
  },

  disease:{
    color:"#065f46"
  },

  card:{
    background:"#f0fdf4",
    padding:"15px",
    borderRadius:"8px",
    marginTop:"15px"
  },

  doneBtn:{
    marginTop:"20px",
    padding:"10px 20px",
    background:"#065f46",
    color:"white",
    border:"none",
    borderRadius:"6px",
    cursor:"pointer"
  }
};