import React, { useState } from "react";
import axios from "axios";
import "./upload-file.css";

function UploadFile() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/upload/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
    } catch (error) {
      console.error("Erreur lors de l'envoi du fichier :", error);
    }
  };

  return (
    <div className="main">
      <h1>Upload your file</h1>
      <div className="inputFile">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Télécharger</button>
      </div>
    </div>
  );
}

export default UploadFile;
