import { useState } from "react";
import { useDispatch } from "react-redux";
import { startLiveSession, endLiveSession } from "../Redux/Slices/CourseSlice";
import { MdClose } from "react-icons/md";

function GoLiveModal({ course, isOpen, onClose, isLiveActive }) {
    const dispatch = useDispatch();
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [title, setTitle] = useState(course?.title || "");
    const [description, setDescription] = useState(course?.description || "");
    const [isLoading, setIsLoading] = useState(false);

    const handleStartLive = async (e) => {
        e.preventDefault();
        
        if (!youtubeUrl.trim()) {
            alert("Please enter a valid YouTube URL");
            return;
        }

        setIsLoading(true);
        try {
            await dispatch(startLiveSession({
                courseId: course._id,
                youtubeUrl: youtubeUrl.trim(),
                title: title || course?.title,
                description: description || course?.description,
            }));
            // Clear form and close modal
            setYoutubeUrl("");
            setTitle("");
            setDescription("");
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    const handleEndLive = async () => {
        if (window.confirm("Are you sure you want to end the live session?")) {
            setIsLoading(true);
            try {
                await dispatch(endLiveSession(course._id));
                onClose();
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md text-white">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-yellow-500">
                        {isLiveActive ? "Live Session Active" : "Go Live"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <MdClose size={24} />
                    </button>
                </div>

                {isLiveActive ? (
                    <div className="space-y-6">
                        <div className="bg-red-600 bg-opacity-20 border border-red-600 rounded p-4">
                            <p className="text-red-400 font-semibold">🔴 LIVE NOW</p>
                            <p className="text-sm text-gray-300 mt-2">
                                Your class is currently live for enrolled students
                            </p>
                        </div>

                        {course?.liveSession?.youtubeUrl && (
                            <div className="bg-gray-800 rounded p-4">
                                <p className="text-sm text-gray-400 mb-2">YouTube URL:</p>
                                <p className="text-yellow-400 break-all text-sm">
                                    {course.liveSession.youtubeUrl}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleEndLive}
                            disabled={isLoading}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 transition-all py-2 px-4 rounded font-semibold"
                        >
                            {isLoading ? "Ending..." : "End Live Session"}
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleStartLive} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                YouTube Live URL *
                            </label>
                            <input
                                type="url"
                                value={youtubeUrl}
                                onChange={(e) => setYoutubeUrl(e.target.value)}
                                placeholder="https://youtu.be/... or https://youtube.com/watch?v=..."
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                                required
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Enter your YouTube Live URL or pre-recorded video URL
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Session Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Live Q&A Session"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief description for students..."
                                rows="3"
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 resize-none"
                            />
                        </div>

                        <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded p-3 text-sm">
                            <p className="text-blue-300">
                                ℹ️ Only enrolled students will be able to access this live session.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 transition-all py-2 px-4 rounded font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-700 transition-all py-2 px-4 rounded font-semibold text-black"
                            >
                                {isLoading ? "Starting..." : "Start Live"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default GoLiveModal;
