import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class UploadsService {
    constructor() {}

    // Define the multer storage configuration
    storage = diskStorage({
        destination: './uploads', // Specify the destination folder to store the uploaded images
        filename: (req, file, cb) => {
            const uniqueSuffix =
                Date.now() + '-' + Math.round(Math.random() * 1e9);
            const fileExtension = extname(file.originalname);
            cb(null, uniqueSuffix + fileExtension); // Generate a unique filename for the uploaded image
        },
    });

    // Configure the multer upload options
    multerOptions = {
        storage: this.storage,
        limits: {
            fileSize: 1024 * 1024 * 5, // Limit the file size (in this case, 5MB)
        },
    };
}
