import multer from 'multer';
import {dateTime} from '../services/dateTime.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {dirname} from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

function uploadImage(__path){
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const folderName = req.body.name + dateTime();
            const targetDir = path.join(__dirname, '..', '..', 'public', 'image', __path, folderName);
            console.log(targetDir ," && p: ", __path);
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }
            
            req.folderName = folderName;
            cb(null, targetDir);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    });
    return multer({ storage });
}

export {uploadImage};