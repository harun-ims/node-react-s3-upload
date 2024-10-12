import { Request, Response } from "express";
import AWS from "aws-sdk";

// Initialize AWS S3 SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const generatePresignedUrl = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { fileName, fileType } = req.query;

    if (!fileName || !fileType) {
      return res
        .status(400)
        .json({ message: "File name and type are required." });
    }

    const params = {
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: fileName as string,
      Expires: 60, // URL expiry in seconds
      ContentType: fileType as string,
    };

    s3.getSignedUrl("putObject", params, (err, url) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to generate pre-signed URL." });
      }
      res.status(200).json({ url });
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to generate pre-signed URL." });
  }
};

export const uploadFile = async (req: Request, res: Response): Promise<any> => {
  try {
    const { fileUrl } = req.body;

    if (!fileUrl) {
      return res.status(400).json({ message: "File URL is required." });
    }

    // Here you would save the fileUrl to your database or process it as needed.
    console.log(`File uploaded to S3 at URL: ${fileUrl}`);

    return res
      .status(200)
      .json({ message: "File URL received successfully.", fileUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to upload file." });
  }
};
