import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { LogHandler, LogLevel } from 'ezpzos.core';

const logger = new LogHandler('uploadImageMiddleware.ts');

const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];

export const uploadImageMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        logger.Log('UploadImage', 'Only PNG and JPEG files are allowed', LogLevel.WARN);
        return cb(null, false); // Reject the file
      }
      cb(null, true); // Accept the file
    },
  }).single('avatar');

  // Call the Multer upload function
  upload(req, res, function (err: any) {
    if (err) {
      logger.Log('UploadImage', `Multer Error: ${err.message}`, LogLevel.ERROR);
      return res.status(400).send({ message: 'File upload failed. Only PNG and JPEG files are allowed.', error: err.message });
    }
    next(); // Continue to the next middleware or route handler
  });
};