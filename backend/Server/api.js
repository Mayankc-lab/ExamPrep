import cloudinary from 'cloudinary';

import connectionToDB from './config/dbConnection.js';
import app from './app.js';

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: process.env.CLOUDINARY_SECURE,
});

let databaseConnection;

const handler = async (req, res) => {
    databaseConnection ??= connectionToDB();

    if (!(await databaseConnection)) {
        databaseConnection = undefined;
        res.status(503).send('Database unavailable');
        return;
    }

    return app(req, res);
};

export default handler;