import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';


(async function () {
    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
})();

export default cloudinary;