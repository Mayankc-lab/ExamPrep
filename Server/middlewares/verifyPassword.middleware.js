import AppError from "../utils/error.util.js";

/**
 * @verifyDeletePassword - Middleware to verify admin password for delete operations
 * Requires the password to be sent in the request body
 * Compares it with the environment variable ADMIN_PASSWORD
 */
const verifyDeletePassword = (req, res, next) => {
    const { adminPassword } = req.body;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Mayank@2005';

    if (!adminPassword) {
        return next(new AppError('Admin password is required to delete resources', 403));
    }

    if (adminPassword !== ADMIN_PASSWORD) {
        return next(new AppError('Incorrect admin password. Delete operation cannot proceed.', 403));
    }

    // Password verified, proceed to next middleware/controller
    next();
};

export default verifyDeletePassword;
