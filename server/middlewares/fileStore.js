import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";
import { GridFSBucket } from "mongodb";
import pkg from "mongodb";

const { ObjectId } = pkg;

dotenv.config();

const storage = new GridFsStorage({ url: process.env.MONGO_URL });
const upload = multer({ 
  storage ,
  limits: { fileSize: 1024 * 1024 * 2 },
  fileFilter:(req,file,cb)=>{
    console.log("Size:",file.size)
    if(file.size>1024*1024*2){
      console.log('File size exceeds 2mb')
      return cb(new Error('File size exceeds 2mb'))
    }
    else{
      console.log('File size is within limit')
      cb(null,true)
    }
  }
});//each file can be of 2mb only

const getFileById = async (fileId) => {
  const db = storage.db;
  const bucket = new GridFSBucket(db);
  const objectId = new ObjectId(fileId);
  const downloadStream = bucket.openDownloadStream(objectId);
  return downloadStream;
};

// Custom middleware to check file size before multer
const checkFileSize = (req, res, next) => {
  // Check if the request contains a file
  // if (!req.file) {
  //   return res.status(400).json({ error: 'No file uploaded' });
  // }

  // Check the file size from the Content-Length header
  const contentLength = parseInt(req.headers['content-length'], 10);
  const fileSizeLimit = 1024 * 1024 * 5; // 2MB file size limit
  console.log(contentLength)
  if (contentLength > fileSizeLimit) {
    console.log('File size exceeds 2MB limit')
    return res.status(400).json({ error: 'File size exceeds 2MB limit' });
  }

  // If file size is within the limit, proceed to the next middleware (multer)
  next();
};

// Use the custom middleware before multer
export { upload, getFileById ,checkFileSize};
