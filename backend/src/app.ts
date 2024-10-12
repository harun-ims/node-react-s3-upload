import express from "express";
import cors from "cors";
import fileUploadRoutes from "./routes/file-upload";

export const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/file", fileUploadRoutes);
