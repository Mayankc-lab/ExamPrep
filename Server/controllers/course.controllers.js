import cloudinary from 'cloudinary'
import fs from 'fs/promises'

import asyncHandler from '../middlewares/asyncHAndler.middleware.js';
import Course from "../models/course.model.js"
import AppError from "../utils/error.util.js";

/**
 * @GET_ALL_COURSES
 * Fetches all courses excluding lectures.
 */
export const getAllCourse = asyncHandler(async (req, res, next)=>{
    try {
        const courses = await Course.find({}).select('-lectures');
        res.status(200).json({
            success:true,
            message:'All course',
            courses,
        })
        
    } catch (error) {
        return next(
            new AppError(error.message,500)
        )
    }
      
});
/**
 * @GET_LECTURES_BY_COURSE_ID
 * Fetches lectures for a specific course.
 */
export const getLecturesByCourseId = asyncHandler(async (req, res, next)=>{
    try {
        const {id} = req.params;

        const course = await  Course.findById(id);

        if(!course){
            return next(
                new AppError('Course not found', 404)
            )
        }

        res.status(200).json({
            success:true,
            message:'Course lectures fecthed sucesssfully ',
            lectures:course.lectures,
            notes:course.notes,
        })
        
        
    } catch (error) {
        return next(
            new AppError(error.message,500)
        )
    }
});

/**
 * @ADD_NOTE_TO_COURSE
 * Adds a note entry to a specific course.
 */
export const addNoteToCourseById = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, noteUrl } = req.body;

        if (!title || (!description && !noteUrl && !req.file)) {
            return next(new AppError('Title and a note description, URL or file are required', 400));
        }

        const course = await Course.findById(id);

        if (!course) {
            return next(new AppError('Course not found', 404));
        }

        const noteEntry = {
            title,
            description: description || 'Shared note',
            noteUrl: noteUrl?.trim() || '',
            addedBy: req.user?.name || req.user?.email || 'ADMIN',
        };

        if (req.file) {
            // If Cloudinary is configured with real keys (not placeholders), upload to Cloudinary; otherwise keep locally and serve from /uploads
            const cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
            const apiKey = process.env.CLOUDINARY_API_KEY || '';
            const apiSecret = process.env.CLOUDINARY_API_SECRET || '';
            const cloudConfigured = (
                apiKey && apiKey !== 'your_cloudinary_api_key' &&
                cloudName && cloudName !== 'your_cloudinary_cloud_name' &&
                apiSecret && apiSecret !== 'your_cloudinary_api_secret'
            );

            if (cloudConfigured) {
                try {
                    const result = await cloudinary.v2.uploader.upload(req.file.path, {
                        folder: 'lms/notes',
                        resource_type: 'raw',
                    });

                    if (result) {
                        noteEntry.file = {
                            public_id: result.public_id,
                            secure_url: result.secure_url || result.url || '',
                            original_name: req.file.originalname || req.file.filename,
                            resource_type: result.resource_type || 'raw',
                        };
                    }

                    await fs.rm(`uploads/${req.file.filename}`).catch(() => {});
                } catch (uploadError) {
                    // cleanup and continue with error
                    await fs.rm(`uploads/${req.file?.filename}`).catch(() => {});
                    return next(new AppError(uploadError.message, 500));
                }
            } else {
                // local fallback: do not delete the file; expose it via /uploads route
                noteEntry.file = {
                    public_id: null,
                    secure_url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
                    original_name: req.file.originalname || req.file.filename,
                    resource_type: 'local',
                };
            }
        }

        course.notes.push(noteEntry);

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Note added successfully',
            notes: course.notes,
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
});
/**
 * @CREATE_COURSE
 * Creates a new course and optionally uploads a thumbnail image.
 */
export const createCourse = asyncHandler(async (req, res, next)=>{
    const {title, description , category, createdBy}= req.body;
    if(!title||! description ||! category||!createdBy){
        return next(
            new AppError('Alll fields are required ', 400)
        )
    }
    
    const course = await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail:{
            public_id:'Dummy',
            secure_url:'Dummy'
        },
    });

    if(!course){
        return next(
            new AppError('Course could not created please try again  ', 500)
        )
    }

    if(req.file){
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'lms'
            });
            if(result){
                course.thumbnail.public_id=result.public_id;
                course.thumbnail.secure_url=result.secure_url;
            }
            await fs.rm(`uploads/${req.file.filename}`).catch(() => {});
        }catch (error) {
            return next(
                new AppError(error.message, 500)
            )
        }
    }

    await course.save();

    res.status(200).json({
        success:true,
        message:'Course created sucesssfully ',
        course,
    })
});
/**
 * @UPDATE_COURSE_BY_ID
 * Updates an existing course by ID.
 */
export const updateCourse = asyncHandler(async (req, res, next)=>{
    try {
        const {id}= req.params;

    const course =  await Course.findByIdAndUpdate(
        id,
        {
            $set:req.body
        },
        {
            runValidators: true
        }
    )   
    if(!course){
        return next (
            new AppError("Course with given id does not exist", 500)
        ) 
    }
    
    } catch (error) {
        return next (
            new AppError(error.message, 500)
        )
    }
    res.status(200).json({
        success:true,
        message:'Course Updated sucesssfully ',
    })
});
/**
 * @DELETE_COURSE_BY_ID
 * Deletes a course by its ID.
 */
export const removeCourse = asyncHandler(async (req, res, next)=>{
    try {
        const {id }= req.params;
        const course = await  Course.findById(id);
        if(!course){
            return next (
                new AppError("Course with given id does not exist", 500)
            ) 
        }
        
        await Course.findByIdAndDelete(id);

        res.status(200).json({
            success:true,
            message:'Course Removed sucesssfully ',
        })
        
    } catch (error) {
        return next (
            new AppError(error.message, 500)
        )
    }
});
/**
 * @ADD_LECTURE
 * Adds a lecture to a course and uploads video to Cloudinary.
 */
export const addLectureToCourseById= asyncHandler(async(req, res, next )=>{
    const { title, description} = req.body;

    const {id }= req.params;
    if(!title||! description){
        return next(
            new AppError('Alll fields are required ', 400)
        )
    }

    const course = await Course.findById(id);

    if(!course){
        return next(
            new AppError('Course not found. Create a course first before adding lectures.', 404)
        )
    }

    const lectureData ={
        title,
        description,
        lecture:{}
    }

    const lectureUrl = req.body.lectureUrl?.trim();

    if (req.file) {
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'lms',
                chunk_size:50000000,
                resource_type:'video'
            });
            if(result){
                lectureData.lecture.public_id=result.public_id;
                lectureData.lecture.secure_url=result.secure_url;
            }
            fs.rm(`uploads/${req.file.filename}`);
        } catch (error) {
            return next(
                new AppError(error.message, 500)
            )
        }
    } else if (lectureUrl) {
        lectureData.lecture.secure_url = lectureUrl;
        lectureData.lecture.public_id = 'internet';
    } else {
        return next(
            new AppError('Lecture file or lecture URL is required', 400)
        )
    }

    course.lectures.push(lectureData);
    course.numberOfLectures = course.lectures.length;

    await course.save();

    res.status(200).json({
        success:true,
        message:'lecture Added sucesssfully',
        course,
    })

});
/**
 * @REMOVE_LECTURE
 * Removes a lecture from a course by its ID and deletes the video from Cloudinary.
 */
export const removeLecture =asyncHandler( async(req, res, next )=>{
    try {
        const courseId = req.params.courseId;
        const lectureId = req.params.lectureId;

        const course = await Course.findById(courseId);
        if (!course) {
            return next(new AppError('Course not found', 404));
        }

        // Find the index of the lecture in the array
        const lectureIndex = course.lectures.findIndex(
            (lecture) => lecture._id.toString() === lectureId
        );

        if (lectureIndex === -1) {
            return next(new AppError('Lecture not found', 404));
        }
         const lectureToRemove = course.lectures[lectureIndex].lecture || {};
        const publicId = lectureToRemove.public_id;

        if (publicId && publicId !== 'internet' && publicId !== 'Dummy') {
            try {
                const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
                const apiKey = process.env.CLOUDINARY_API_KEY;
                const apiSecret = process.env.CLOUDINARY_API_SECRET;

                if (cloudName && apiKey && apiSecret) {
                    await cloudinary.v2.uploader.destroy(publicId, {
                        resource_type: 'video',
                    });
                }
            } catch (cloudError) {
                console.warn('Cloudinary deletion skipped:', cloudError.message);
            }
        }

        course.lectures.splice(lectureIndex, 1);
        course.numberOfLectures = Math.max(0, course.lectures.length);
        
        await course.save();

        res.status(200).json({
            success: true,
            message: 'Lecture removed successfully',
        });

    }catch (error) {
        return next (
            new AppError(error.message, 500)
        )
    }
});

/**
 * @START_LIVE_SESSION
 * Starts a live session for a course with YouTube URL
 */
export const startLiveSession = asyncHandler(async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const { youtubeUrl, title, description } = req.body;

        if (!youtubeUrl) {
            return next(new AppError('YouTube URL is required', 400));
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return next(new AppError('Course not found', 404));
        }

        // Update course with live session info
        course.liveSession = {
            isLive: true,
            youtubeUrl: youtubeUrl.trim(),
            startedAt: new Date(),
            title: title || course.title,
            description: description || course.description,
        };

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Live session started successfully',
            liveSession: course.liveSession,
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
});

/**
 * @END_LIVE_SESSION
 * Ends the live session for a course
 */
export const endLiveSession = asyncHandler(async (req, res, next) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId);

        if (!course) {
            return next(new AppError('Course not found', 404));
        }

        // Reset live session
        course.liveSession = {
            isLive: false,
            youtubeUrl: '',
            startedAt: null,
            title: '',
            description: '',
        };

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Live session ended successfully',
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
});

/**
 * @GET_LIVE_SESSION
 * Gets the live session details for a course
 */
export const getLiveSession = asyncHandler(async (req, res, next) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId);

        if (!course) {
            return next(new AppError('Course not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Live session details fetched successfully',
            liveSession: course.liveSession,
        });
    } catch (error) {
        return next(new AppError(error.message, 500));
    }
});