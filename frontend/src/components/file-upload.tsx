import React, { useState } from "react";
import axios from "axios";

const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const fileName = selectedFile.name;
    const fileType = selectedFile.type;

    try {
      // Step 1: Get pre-signed URL from server
      const response = await axios.get(
        "http://localhost:5000/api/file/presigned-url",
        {
          params: {
            fileName,
            fileType,
          },
        }
      );

      const { url } = response.data;

      // Step 2: Upload the file directly to S3 using the pre-signed URL
      await axios.put(url, selectedFile, {
        headers: {
          "Content-Type": fileType,
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });

      // Step 3: Send the uploaded file URL to the server
      const fileUrl = url.split("?")[0]; // Extract the file URL without the pre-signed query parameters
      await axios.post("http://localhost:5000/api/file/upload", { fileUrl });

      alert("File uploaded and URL sent to server successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {uploadProgress !== null && <p>Upload Progress: {uploadProgress}%</p>}
    </div>
  );
};

export default FileUpload;
