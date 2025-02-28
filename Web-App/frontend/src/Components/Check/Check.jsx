import React, { useState, useEffect } from "react";
import axios from "axios";
import gsap from "gsap";
import "./Check.css";

const Check = () => {
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      ".check-health-container",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    if (image) {
      gsap.fromTo(
        ".analysis-container",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );
    }
  }, [image]);

  useEffect(() => {
    if (result) {
      gsap.fromTo(
        ".result-box",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
      );
    }
  }, [result]);

  // Convert image to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1]; // Remove data type prefix
        setBase64Image(base64String);
      };
    }
  };

  // Drag & Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        setBase64Image(base64String);
      };
    }
  };

  // Send Image to Both APIs
  const handleAnalyze = async () => {
    if (!base64Image) return;
    setLoading(true);
    setResult(null);

    let myApiResult = null;
    let roboflowResult = null;

    // **Step 1: Try My API First**
    try {
      const formData = new FormData();
      formData.append("image", base64Image); // Assuming your Flask API expects a file

      const myApiResponse = await axios.post(
        "https://coral-sense-backend.onrender.com/predict",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      myApiResult = myApiResponse.data.prediction;
      console.log("My API Result:", myApiResult);
    } catch (error) {
      console.error("My API failed:", error);
    }

    // **Step 2: Try Roboflow API**
    try {
      const roboflowResponse = await axios({
        method: "POST",
        url: "https://classify.roboflow.com/coral-reef-bleach-detection/2",
        params: { api_key: "t7w2f6CHZP3iCelMtVzY" },
        data: base64Image,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const predictions = roboflowResponse.data.predictions;
      roboflowResult = roboflowResponse.data.predicted_classes[0]; // Most confident class
      console.log("Roboflow Result:", roboflowResult);
    } catch (error) {
      console.error("Roboflow API failed:", error);
    }

    // **Step 3: Choose Final Result Based on Conditions**
    let finalResult = "";
    if (myApiResult && roboflowResult) {
      if (myApiResult === roboflowResult) {
        finalResult = myApiResult; // Both APIs agree → Show the result
      } else {
        finalResult = myApiResult; // My API and Roboflow are different → Show My API's result
      }
    } else if (myApiResult) {
      finalResult = myApiResult; // My API worked but Roboflow didn't
    } else if (roboflowResult) {
      finalResult = roboflowResult; // Roboflow worked but My API didn't
    } else {
      finalResult = "API error or server down"; // Both APIs failed
    }

    setResult({ predictedClass: finalResult, image });
    setLoading(false);
  };

  return (
    <div className="check-health-container">
      <h2>Check Coral Health</h2>
      <p>Upload a coral reef image to analyze its health.</p>
      <br />
      {/* Drag & Drop Upload Box */}
      <div
        className={`upload-box ${dragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput").click()}
      >
        {image ? (
          <img src={image} alt="Uploaded Coral" className="uploaded-image" />
        ) : (
          <p>
            Drag & drop an image here, or <span>click to upload</span>
          </p>
        )}
        <input type="file" id="fileInput" accept="image/*" onChange={handleImageChange} hidden />
      </div>

      {/* Analysis Section */}
      {image && (
        <div className="analysis-container">
          <div className="image-container">
            <p>Input Image</p>
            <img src={image} alt="Uploaded Coral" className="input-image" />
          </div>

          <div className="image-container">
            <p>Result</p>
            <div className="result-box">
              {loading ? (
                <p className="loading-text">Analyzing...</p>
              ) : result ? (
                <div className="result-image-container">
                  <img src={result.image} alt="Processed Coral" className="result-image" />
                  <div className={`result-tag ${result.predictedClass === "Bleached" ? "bleached" : "healthy"}`}>
                    {result.predictedClass}
                  </div>
                </div>
              ) : (
                <p className="placeholder-text">Click Analyze to Get Result</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Analyze Button */}
      <button className="analyze-btn" onClick={handleAnalyze} disabled={!base64Image || loading}>
        {loading ? "Analyzing..." : "Analyze Coral"}
      </button>
    </div>
  );
};

export default Check;
