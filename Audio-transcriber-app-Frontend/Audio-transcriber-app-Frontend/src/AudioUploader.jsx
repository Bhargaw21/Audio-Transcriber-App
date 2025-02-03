import React, { useState } from "react";
import axios from "axios";
import "./AudioUploader.css";

const AudioUploader = () => {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setTranscription(""); // Clear previous transcription
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an audio file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/transcribe",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setTranscription(response.data);
    } catch (error) {
      console.error("Error transcribing audio", error);
      alert("Failed to transcribe the audio. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="uploader-container">
      <h1 className="title">Audio to Text Transcriber</h1>
      <div className="upload-section">
        <label className="file-label">
          Select Audio File
          <input
            type="file"
            accept="audio/*"
            className="file-input"
            onChange={handleFileChange}
          />
        </label>
        <button
          className={`upload-button ${isUploading ? "loading" : ""}`}
          onClick={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload & Transcribe"}
        </button>
      </div>
      <div className="transcription-section">
        <h2 className="subtitle">Transcription Result</h2>
        <p className="transcription-text">
          {transcription || "No transcription available yet."}
        </p>
      </div>
    </div>
  );
};

export default AudioUploader;
