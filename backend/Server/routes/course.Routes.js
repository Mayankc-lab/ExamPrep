import {Router} from 'express'

import { getAllCourse, getLecturesByCourseId, createCourse, updateCourse, removeCourse, addLectureToCourseById, removeLecture, addNoteToCourseById, startLiveSession, endLiveSession, getLiveSession } from '../controllers/course.controllers.js';
import { authorizedRoles, authorizedSubscriber, isLoggedIn } from '../middlewares/auth.middlewares.js';
import upload from '../middlewares/multer.middlewares.js';
import verifyDeletePassword from '../middlewares/verifyPassword.middleware.js';

const router = Router();
/**
 * @route GET /courses
 * @description Get all courses
 * @access Public
 */
router.route('/')
    .get( 
        getAllCourse
    )
    .post(
            isLoggedIn,
            authorizedRoles('ADMIN'),
            upload.single('thumbnail'), 
           createCourse
        );
/**
 * @route GET, PUT, DELETE /courses/:id
 * @description Get, update, or remove a course by ID
 * @access Admin only
 */
router.route('/:id/notes')
    .post(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        upload.single('noteFile'),
        addNoteToCourseById
    );

router.route('/:id')
    .get(
        isLoggedIn,
        authorizedSubscriber,
        getLecturesByCourseId
    )
    .put(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        updateCourse
    )
    .delete(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        verifyDeletePassword,
        removeCourse
    )
    .post(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        upload.single('lecture'), 
        addLectureToCourseById
    );
    /**
 * @route DELETE /courses/:courseId/lectures/:lectureId
 * @description Remove a specific lecture from a course
 * @access Admin only
 */
    router.route('/:courseId/lectures/:lectureId') .delete(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        verifyDeletePassword,
        removeLecture,
    )

/**
 * @route POST /courses/:courseId/live/start
 * @description Start a live session for a course
 * @access Admin only
 */
router.route('/:courseId/live/start')
    .post(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        startLiveSession
    );

/**
 * @route POST /courses/:courseId/live/end
 * @description End the live session for a course
 * @access Admin only
 */
router.route('/:courseId/live/end')
    .post(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        endLiveSession
    );

/**
 * @route GET /courses/:courseId/live
 * @description Get live session details for a course
 * @access Public
 */
router.route('/:courseId/live')
    .get(
        getLiveSession
    );

export default router;