import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import HomeLayout from "../../Layouts/HomeLayout";
import { getAllCourse } from "../../Redux/Slices/CourseSlice";
import { isYoutubeUrl, toEmbedUrl } from "../../Helper/videoUtils";

function LiveClasses() {
    const dispatch = useDispatch();
    const { courseData } = useSelector((state) => state.course);
    const { isLoggedIn, role, data: userData } = useSelector((state) => state.auth);
    const subscriptionStatus = String(userData?.subscription?.status || '').toLowerCase();
    const hasActiveSubscription = subscriptionStatus === 'active' || subscriptionStatus === 'created';
    const canJoinLiveClasses = Boolean(isLoggedIn && role === 'USER' && hasActiveSubscription);

    async function loadCourses() {
        await dispatch(getAllCourse());
    }

    useEffect(() => {
        loadCourses();
    }, [dispatch]);

    const rawEnrolledCourseIds = Array.isArray(userData?.enrolledCourses)
        ? userData.enrolledCourses
        : [];

    const enrolledCourseIds = rawEnrolledCourseIds.map((id) => String(id));

    const enrolledLiveCourses = Array.isArray(courseData)
        ? courseData.filter((course) => {
            if (!course?.liveSession?.isLive) return false;
            if (enrolledCourseIds.length === 0) return false;
            return enrolledCourseIds.includes(String(course?._id));
        })
        : [];

    const visibleLiveCourses = canJoinLiveClasses ? enrolledLiveCourses : [];

    return (
        <HomeLayout>
            <div className="min-h-[90vh] pt-12 px-4 text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-yellow-500">Live Classes</h1>
                            <p className="text-sm text-gray-400 mt-2">
                                Join your currently active classes from your enrolled courses.
                            </p>
                        </div>
                    </div>

                    {!isLoggedIn && (
                        <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-center">
                            <p className="text-lg font-semibold text-gray-300">
                                Please login to access live classes.
                            </p>
                        </div>
                    )}

                    {isLoggedIn && role !== "USER" && (
                        <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-center">
                            <p className="text-lg font-semibold text-gray-300">
                                Live classes are available for enrolled students.
                            </p>
                        </div>
                    )}

                    {isLoggedIn && role === "USER" && !canJoinLiveClasses && (
                        <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 text-center">
                            <p className="text-lg font-semibold text-gray-300">
                                Your account needs an active subscription to view live classes.
                            </p>
                        </div>
                    )}

                    {canJoinLiveClasses && (
                        visibleLiveCourses.length > 0 ? (
                            <div className="grid gap-8">
                                {visibleLiveCourses.map((course) => (
                                    <div key={course?._id} className="rounded-2xl border border-yellow-500/40 bg-gray-900 p-4 shadow-lg">
                                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-700 pb-4 mb-4">
                                            <div>
                                                <h2 className="text-2xl font-bold text-yellow-500">
                                                    {course?.liveSession?.title || course?.title}
                                                </h2>
                                                <p className="text-sm text-gray-400 mt-2">
                                                    {course?.liveSession?.description || course?.description}
                                                </p>
                                            </div>
                                            <span className="inline-flex items-center rounded-full bg-red-600 px-4 py-2 text-sm font-bold uppercase tracking-wide">
                                                Live Now
                                            </span>
                                        </div>

                                        {course?.liveSession?.youtubeUrl && isYoutubeUrl(course.liveSession.youtubeUrl) ? (
                                            <div className="w-full aspect-video overflow-hidden rounded-lg border border-gray-700 bg-black">
                                                <iframe
                                                    title={course?.title || "Live class"}
                                                    src={toEmbedUrl(course.liveSession.youtubeUrl)}
                                                    className="w-full h-full"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                    allowFullScreen
                                                />
                                            </div>
                                        ) : (
                                            <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
                                                <p className="text-gray-300 font-semibold">
                                                    Live session URL is not available yet.
                                                </p>
                                            </div>
                                        )}

                                        <div className="mt-4 flex flex-wrap items-center gap-3">
                                            <span className="text-sm text-gray-400">
                                                Course:
                                            </span>
                                            <span className="text-sm font-semibold text-white">
                                                {course?.title}
                                            </span>
                                            <span className="text-sm text-gray-500">|</span>
                                            <span className="text-sm text-gray-400">
                                                Instructor:
                                            </span>
                                            <span className="text-sm font-semibold text-white">
                                                {course?.createdBy}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-lg border border-gray-700 bg-gray-900 p-10 text-center">
                                <p className="text-xl font-semibold text-gray-300">
                                    No live classes are running right now.
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Admins can start a live session for enrolled students from the course dashboard.
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </HomeLayout>
    );
}

export default LiveClasses;
