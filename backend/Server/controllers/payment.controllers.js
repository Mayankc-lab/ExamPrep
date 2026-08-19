import crypto from 'crypto'

import asyncHandler from '../middlewares/asyncHAndler.middleware.js';
import Payment from '../models/payment.model.js';
import User from '../models/usermodel.js';
import Course from '../models/course.model.js';
import AppError from "../utils/error.util.js";
import razorpay from '../config/razorpay.js';

const isRazorpayConfigured = () => {
    const key = String(process.env.RAZORPAY_KEY_ID || '').trim();
    const secret = String(process.env.RAZORPAY_SECRET || '').trim();
    const plan = String(process.env.RAZORPAY_PLAN_ID || '').trim();

    return Boolean(
        key &&
        secret &&
        plan &&
        key !== 'your_razorpay_key_id' &&
        secret !== 'your_razorpay_secret_key' &&
        plan !== 'your_razorpay_plan_id'
    );
};

const grantSubscriptionAccess = async (user) => {
    const courses = await Course.find({}, { _id: 1 });
    const courseIds = courses.map((course) => course._id);

    user.subscription = {
        ...(user.subscription || {}),
        id: user.subscription?.id || 'local-subscription',
        status: 'active',
    };
    user.enrolledCourses = courseIds;

    await user.save();

    await Course.updateMany(
        {},
        {
            $set: {
                'liveSession.isLive': true,
                'liveSession.youtubeUrl': 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
                'liveSession.startedAt': new Date(),
                'liveSession.title': 'Live Class Session',
                'liveSession.description': 'Live class is open for enrolled students',
            }
        }
    );

    return user;
};

/**
 * @GET_RAZORPAY_ID
 * Returns the Razorpay API key for the client-side.
 */
export const getRaZorpayApikey =asyncHandler(async(req, res, next)=>{
    try {
        const key = isRazorpayConfigured() ? process.env.RAZORPAY_KEY_ID : '';

        res.status(200).json({
            success:true,
            message:'Razarpay API key ',
            key,
        });
    } catch (error) {
        return next(
            new AppError(error.message, 500)
        ) 
    }
  
});
/**
 * @ACTIVATE_SUBSCRIPTION
 * Handles the subscription process for the user by creating a new Razorpay subscription.
 */
export const buySubscription =asyncHandler(async(req, res, next)=>{
    try {
        const {id}= req.user;
        const user =await User.findById(id);
        if(!user){
            return next(
                new AppError("Unauthorize , please login")
            )
        }
        if(user.role==='ADMIN'){
            return next(
                new AppError(" Admin cannot purchase a subscription", 400)
            ) 
        }

        if (user.subscription?.id && user.subscription?.status === 'created') {
            await user.save()

            res.status(200).json({
                success: true,
                message: "subscribed successfully",
                subscription_id: user.subscription.id
            })
        } else if (!isRazorpayConfigured()) {
            const updatedUser = await grantSubscriptionAccess(user);

            res.status(200).json({
                success:true,
                message:'Subscription activated successfully',
                subscription_id: updatedUser.subscription.id,
                local: true,
                user: updatedUser,
            });
        } else {
            const subscription = await razorpay.subscriptions.create({
                plan_id:process.env.RAZORPAY_PLAN_ID,
                customer_notify:1  ,
                total_count: 12,
            });
            user.subscription.id = subscription.id;

            user.subscription.status= subscription.status;
        
            await user.save();
            console.log(user.subscription.id);
            res.status(200).json({
                success:true,
                message:'Subscribed Sucessfully ',
                subscription_id:subscription.id
            });
      }
    } catch (error) {
        return next(
            new AppError(error.message, 500)
        ) 
    }
 
});
/**
 * @VERIFY_SUBSCRIPTION
 * Verifies the payment for the subscription by validating the Razorpay payment signature.
 */
export const verifySubscription =asyncHandler(async(req, res, next)=>{
    try {
        const {id }= req.user;
        const {razorpay_payment_id, razorpay_signature , razorpay_subscription_id }= req.body;
    
        const user =await User.findById(id);
        if(!user){
            return next(
                new AppError("Unauthorize , please login")
            )
        }

        if (!isRazorpayConfigured()) {
            const updatedUser = await grantSubscriptionAccess(user);
            return res.status(200).json({
                success:true,
                message:'Subscription verified successfully',
                local: true,
                user: updatedUser,
            });
        }

        const subscriptionId= user.subscription.id;

        const generateSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
                                                            .update(`${razorpay_payment_id}|${subscriptionId }`)
                                                            .digest('hex')
                                  
        if (generateSignature !== razorpay_signature) {
            return next(createError(400, "payment not verified , please try again"))
        }
      
        await Payment.create({
            razorpay_payment_id,
            razorpay_signature,
            razorpay_subscription_id,
        })

        // Enroll user in all courses when payment is verified
        const updatedUser = await grantSubscriptionAccess(user);
    
        res.status(200).json({
            success:true,
            message:'Payment verified Sucessfully ',
            user: updatedUser,
        });
    } catch (error) {
        return next(
            new AppError(error.message, 500)
        )
    }
  
});
/**
 * @CANCEL_SUBSCRIPTION
 * Cancels the user's subscription with Razorpay and updates the user's subscription status to inactive.
 */
export const cancelSubscription =asyncHandler(async(req, res, next)=>{

    try {
        const {id}= req.user;

        const user = await User.findById(id);
        if(!user){
            return next(
                new AppError("Unauthorize , please login")
            )
        }
        if(user.role==='ADMIN'){
            return next(
                new AppError(" Admin cannot purchase a subscription", 400)
            ) 
        }

        if (!isRazorpayConfigured()) {
            user.subscription = {
                ...(user.subscription || {}),
                id: 'local-subscription',
                status: 'inactive',
            };
            await user.save();
            return res.status(200).json({
                success:true,
                message:'UnSubscribed  Sucessfully ',
            });
        }

        const subscriptionId= user.subscription.id;
        const subscription =await razorpay.subscriptions.cancel(
            subscriptionId
        )
        user.subscription.status='Inactive';

        await user.save();

        res.status(200).json({
            success:true,
            message:'UnSubscribed  Sucessfully ',
        });
    } catch (error) {
        return next(
            new AppError(error.message, 500)
        )
    }
    
});
/**
 * @GET_RAZORPAY_ID
 * Fetches and returns the payment records for all subscriptions, with monthly payment statistics.
 */
export const allPayments =asyncHandler(async(req, res, next)=>{
    try {
        const { count, skip } = req.query;

        let allPayments = {
            items: [],
            count: 0,
            skip: 0,
        };

        const hasRazorpayConfig = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_SECRET && process.env.RAZORPAY_PLAN_ID;

        if (hasRazorpayConfig && razorpay?.subscriptions?.all) {
            try {
                allPayments = await razorpay.subscriptions.all({
                    count: count ? Number(count) : 10,
                    skip: skip ? Number(skip) : 0,
                });
            } catch (razorpayError) {
                console.warn('Razorpay payment fetch failed:', razorpayError.message);
            }
        }

        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];

        const finalMonths = {
            January: 0,
            February: 0,
            March: 0,
            April: 0,
            May: 0,
            June: 0,
            July: 0,
            August: 0,
            September: 0,
            October: 0,
            November: 0,
            December: 0,
        };

        const monthlyWisePayments = (allPayments.items || []).map((payment) => {
            const paymentDate = payment?.start_at ? new Date(payment.start_at * 1000) : new Date();
            return monthNames[paymentDate.getMonth()];
        });

        monthlyWisePayments.forEach((month) => {
            if (finalMonths[month] !== undefined) {
                finalMonths[month] += 1;
            }
        });

        const monthlySalesRecord = Object.keys(finalMonths).map((monthName) => finalMonths[monthName]);

        res.status(200).json({
            success: true,
            message: 'All payments',
            allPayments,
            finalMonths,
            monthlySalesRecord,
        });
    } catch (error) {
        return next(
            new AppError(error.message, 500)
        );
    }
});