import React, { useState, useEffect } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import './Check.css';

const Check = () => {
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    gsap.fromTo(".check-health-container", 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    if (image) {
      gsap.fromTo(".analysis-container", 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );
    }
  }, [image]);

  useEffect(() => {
    if (result) {
      gsap.fromTo(".result-box", 
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

  // Send Image to Roboflow
  const handleAnalyze = async () => {
    if (!base64Image) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await axios({
        method: "POST",
        url: "https://classify.roboflow.com/coral-reef-bleach-detection/2",
        params: {
          api_key: "t7w2f6CHZP3iCelMtVzY"
        },
        data: base64Image,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      const predictions = response.data.predictions;
      const predictedClass = response.data.predicted_classes[0]; // Most confident class
      const confidence = predictions[predictedClass].confidence.toFixed(2);

      setResult({ predictedClass, confidence, image });
    } catch (error) {
      console.error("Error analyzing image:", error);
      setResult({ error: "Failed to analyze image" });
    }

    setLoading(false);
  };

  return (
    <div className="check-health-container">
      <h2>Check Coral Health</h2>
      <p>Upload a coral reef image to analyze its health.</p>
      <br />
      {/* Drag & Drop Upload Box */}
      <div
        className={`upload-box ${dragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput').click()}
      >
        {image ? (
          <img src={image} alt="Uploaded Coral" className="uploaded-image" />
        ) : (
          <p>Drag & drop an image here, or <span>click to upload</span></p>
        )}
        <input type="file" id="fileInput" accept="image/*" onChange={handleImageChange} hidden />
      </div>

      {/* Analysis Section (Left: Uploaded Image | Right: Result Box) */}
      {image && (
        <div className="analysis-container">
          {/* Left: Uploaded Image */}
          <div className="image-container">
            <p>Input Image</p>
            <img src={image} alt="Uploaded Coral" className="input-image" />
          </div>

          {/* Right: Result Image Box (Blank Until Analyzed) */}
          <div className="image-container">
            <p>Result</p>
            <div className="result-box">
              {loading ? (
                <p className="loading-text">Analyzing...</p>
              ) : result ? (
                <div className="result-image-container">
                  <img src={result.image} alt="Processed Coral" className="result-image" />
                  <div className={`result-tag ${result.predictedClass === 'Bleached' ? 'bleached' : 'healthy'}`}>
                    {result.predictedClass} ({result.confidence})
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
        {loading ? 'Analyzing...' : 'Analyze Coral'}
      </button>
    </div>
  );
};

export default Check;
