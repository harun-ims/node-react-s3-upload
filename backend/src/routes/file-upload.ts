import { Router } from "express";
import { generatePresignedUrl, uploadFile } from "../controllers/file-upload";

const router = Router();

// Route to generate pre-signed URL
router.get("/presigned-url", generatePresignedUrl);

// Route to handle the URL of the uploaded file
router.post("/upload", uploadFile);

export default router;
