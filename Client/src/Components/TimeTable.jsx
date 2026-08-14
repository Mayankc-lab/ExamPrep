import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourse } from "../Redux/Slices/CourseSlice";

function TimeTable() {
    const dispatch = useDispatch();
    const { courseData } = useSelector((state) => state.course);

    useEffect(() => {
        dispatch(getAllCourse());
    }, [dispatch]);

    // Time slots - 3 classes per day
    const timeSlots = [
        "09:00 AM - 10:30 AM",
        "11:00 AM - 12:30 PM",
        "02:00 PM - 03:30 PM",
    ];

    // Days - Monday to Saturday (No Sunday)
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Create day-wise schedule with 3 classes per day
    const createDayWiseSchedule = () => {
        const dayWiseSchedule = {};
        let courseIndex = 0;

        days.forEach((day) => {
            dayWiseSchedule[day] = [];
            timeSlots.forEach(() => {
                if (courseIndex < courseData.length) {
                    dayWiseSchedule[day].push({
                        time: timeSlots[dayWiseSchedule[day].length],
                        course: courseData[courseIndex].title,
                        category: courseData[courseIndex].category,
                    });
                    courseIndex = (courseIndex + 1) % courseData.length; // Alternate/rotate courses
                } else if (courseData.length > 0) {
                    dayWiseSchedule[day].push({
                        time: timeSlots[dayWiseSchedule[day].length],
                        course: courseData[courseIndex % courseData.length].title,
                        category: courseData[courseIndex % courseData.length].category,
                    });
                    courseIndex++;
                }
            });
        });

        return dayWiseSchedule;
    };

    const dayWiseSchedule = createDayWiseSchedule();

    return (
        <div className="py-16 px-5 lg:px-16 bg-gray-900 text-white">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl sm:text-5xl font-semibold mb-4 text-center">
                    Class <span className="text-yellow-500">Schedule</span>
                </h2>
                <p className="text-gray-300 text-center mb-12 text-lg">
                    Here are the timings when our classes are arranged every week
                </p>

                {courseData.length > 0 ? (
                    <div className="space-y-8">
                        {days.map((day) => (
                            <div key={day} className="border border-gray-600 rounded-lg overflow-hidden">
                                <div className="bg-yellow-500 text-black px-6 py-4">
                                    <h3 className="text-2xl font-semibold">{day}</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-800 border-b border-gray-600">
                                                <th className="px-6 py-3 text-left font-semibold text-gray-300">Time</th>
                                                <th className="px-6 py-3 text-left font-semibold text-gray-300">Course</th>
                                                <th className="px-6 py-3 text-left font-semibold text-gray-300">Category</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dayWiseSchedule[day].map((session, idx) => (
                                                <tr 
                                                    key={idx}
                                                    className={`${
                                                        idx % 2 === 0 ? "bg-gray-750" : "bg-gray-800"
                                                    } border-b border-gray-600 hover:bg-gray-700 transition-colors duration-200`}
                                                >
                                                    <td className="px-6 py-4 text-gray-300 font-medium">
                                                        {session.time}
                                                    </td>
                                                    <td className="px-6 py-4 text-white font-semibold">
                                                        {session.course}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-400">
                                                        {session.category}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">No courses available yet. Check back soon!</p>
                    </div>
                )}

                <div className="mt-12 p-6 bg-yellow-500 bg-opacity-10 border-l-4 border-yellow-500 rounded">
                    <p className="text-gray-200">
                        <span className="text-yellow-500 font-semibold">Note:</span> All times are in IST (Indian Standard Time). 
                        Classes are conducted online via Zoom. Join links will be shared in your dashboard. No classes on Sunday.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default TimeTable;
