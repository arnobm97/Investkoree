import express from 'express';
import multer from 'multer';
import { createFounderPost } from '../controllers/founderFormController.js';
import { authToken } from '../utils/authMiddleware.js';

const router = express.Router();

// Configure multer for file upload using memory storage
const storage = multer.memoryStorage(); // Files are stored in memory as Buffer objects

// Create the multer instance
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|pdf|doc|txt|ppt/; // Allowed file types
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Error: File type not allowed!'));
    }
  }
});

// Multiple image fields and single file upload
const cpUpload = upload.fields([
  { name: "businessPicture", maxCount: 10 }, // multiple images
  { name: "nidCopy", maxCount: 1 }, // single file
  { name: "tinCopy", maxCount: 1 },
  { name: "taxCopy", maxCount: 1 },
  { name: "tradeLicense", maxCount: 1 },
  { name: "bankStatement", maxCount: 1 },
  { name: "securityFile", maxCount: 1 },
  { name: "financialFile", maxCount: 1 },
]);

// Define the route for creating a founder post
router.post("/postdata", authToken, cpUpload, (req, res, next) => {
    console.log("Files in req.files:", req.files); // Files should now be Buffer objects
    next();
}, createFounderPost);

export default router;
