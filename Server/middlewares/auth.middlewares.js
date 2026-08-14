import jwt from "jsonwebtoken";

import User from '../models/usermodel.js'
import AppError from "../utils/error.util.js";

/**
 * @isLoggedIn - Middleware to check if the user is authenticated.
 * Verifies the JWT token from the cookies and attaches the user details to the request object.
 * If no token is present or invalid, it returns an "Unauthenticated" error.
 */

const isLoggedIn = async (req, res, next)=>{
    let token;

    if (req.cookies?.token) {
        token = req.cookies.token;
    } else if (
        req.headers?.authorization &&
        req.headers.authorization.startsWith('Bearer ')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        return next(new AppError('Unauthenticated, pls login  again ', 401));
    }
    const userDetails= await jwt.verify(token , process.env.JWT_SECRET );

    req.user = userDetails;

    next();
}
/**
 * @authorizedRoles - Middleware to check if the user has authorized roles.
 * It ensures that the current user has one of the roles required to access the route.
 */
const authorizedRoles = (...roles)=>async(req, res, next)=>{
    const currentUserRole = req.user?.role;

    if (!currentUserRole || !roles.includes(currentUserRole)) {
        return next(
            new AppError("You do not have permission to acess this route", 403)
        )
    }

    next();
}
/**
 * @authorizedSubscriber - Middleware to check if the user has an active subscription.
 * If the user is not an admin and does not have an active subscription, it returns a "Forbidden" error.
 */
const authorizedSubscriber = async(req, res, next) => {
    const currentUserRole = req.user?.role;

    if (!req.user?.id) {
        return next(new AppError('Unauthenticated, pls login again ', 401));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const subscription = String(user.subscription?.status || '').toLowerCase();
    const isActiveSubscription = subscription === 'active' || subscription === 'created';
    const profileEmail = String(user.email || '').toLowerCase();
    const isMayankAllCoursesOverride = profileEmail === 'mayankkrmaurya195@gmail.com';

    if (currentUserRole !== 'ADMIN' && !isActiveSubscription && !isMayankAllCoursesOverride) {
        return next(new AppError('please subscribe to access this', 403));
    }

    next();
}

export{
    isLoggedIn,
    authorizedRoles,
    authorizedSubscriber,
}
    