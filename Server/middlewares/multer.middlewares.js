import multer from "multer";
import path from "path";

/**
 * @upload - Middleware to handle file uploads using multer.
 * The configuration sets the file size limit, file storage location, and file filter for allowed file types.
 */
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 mb in size max limit
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (_req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  }),
  fileFilter: (_req, file, cb) => {
    let ext = path.extname(file.originalname);

    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".webp" &&
      ext !== ".png" &&
      ext !== ".svg" &&
      ext !== ".mp4" &&
      ext !== ".pdf" &&
      ext !== ".doc" &&
      ext !== ".docx" &&
      ext !== ".ppt" &&
      ext !== ".pptx"
    ) {
      cb(new Error(`Unsupported file type! ${ext}`), false);
      return;
    }

    cb(null, true);
  },
});

export default upload;