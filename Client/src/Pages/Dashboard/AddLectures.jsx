import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { addCourseLectures } from "../../Redux/Slices/LectureSlice";
import { isYoutubeUrl, toEmbedUrl } from "../../Helper/videoUtils";

function AddCourseLectures (){
    const location = useLocation();
    const params = useParams();
    const courseDetails = location.state;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userInput, setUserInput] = useState({
        id: courseDetails?._id || "",
        lecture: undefined,
        title: "",
        description: "",
        videoUrl: "",
        videoSrc: ""
    });

    function handleInputChange(e) {
        const {name, value} = e.target;
        if (name === 'videoUrl') {
            setUserInput((prev) => ({
                ...prev,
                [name]: value,
                lecture: undefined,
                videoSrc: value
            }));
            return;
        }
        setUserInput((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    function handleVideo(e) {
        const video = e.target.files[0];
        if (!video) return;
        const source = window.URL.createObjectURL(video);
        setUserInput((prev) => ({
            ...prev,
            lecture: video,
            videoUrl: "",
            videoSrc: source
        }));
    }

    async function onFormSubmit(e) {
        e.preventDefault();

        const courseId = courseDetails?._id || courseDetails?.id || params.courseId || userInput.id;

        if (!courseId) {
            toast.error("Please open this page from a course page.");
            return;
        }

        if ((!userInput.lecture && !userInput.videoUrl) || !userInput.title || !userInput.description) {
            toast.error("All fields are mandatory");
            return;
        }

        const payload = {
            ...userInput,
            id: courseId,
        };

        const response = await dispatch(addCourseLectures(payload));
        if (response?.payload?.success) {
            navigate(-1);
            setUserInput({
                id: courseId,
                lecture: undefined,
                title: "",
                description: "",
                videoUrl: "",
                videoSrc: ""
            });
        }
    }

    useEffect(() => {
        const resolvedId = courseDetails?._id || courseDetails?.id || params.courseId;

        if (!resolvedId) {
            toast.error("Please open this page from a course page.");
            navigate("/courses");
            return;
        }

        setUserInput((prev) => ({
            ...prev,
            id: resolvedId
        }));
    }, [courseDetails, params.courseId, navigate]);

    return (
        <HomeLayout>
            <div className="min-h-[90vh] text-white flex flex-col items-center justify-center gap-10 mx-5 sm:mx-16 md:mx-20">
                <div className="flex flex-col gap-5 p-2 shadow-[0_0_10px_black] w-[80vw] md:w-96  rounded-lg">
                    <header className="flex items-center justify-center relative">
                        <button 
                            className="absolute left-2 text-2xl text-green-500"
                            onClick={() => navigate(-1)}
                        >
                            <AiOutlineArrowLeft/>
                        </button>
                        <h1 className="text-xl text-yellow-500 font-semibold">
                            Add new lecture
                        </h1>
                    </header>
                    <form 
                        onSubmit={onFormSubmit} className="flex flex-col gap-3"
                    >

                        <input 
                            type="text"
                            name="title"
                            placeholder="enter the title of the lecture"
                            onChange={handleInputChange}
                            className="bg-transparent px-3 py-1 border"
                            value={userInput.title}
                        />
                        <textarea 
                            type="text"
                            name="description"
                            placeholder="enter the description of the lecture"
                            onChange={handleInputChange}
                            className="bg-transparent px-3 py-1 border resize-none overflow-y-scroll h-36"
                            value={userInput.description}
                        />
                        <input 
                            type="text"
                            name="videoUrl"
                            placeholder="enter a remote video URL (MP4 or YouTube)"
                            onChange={handleInputChange}
                            className="bg-transparent px-3 py-1 border"
                            value={userInput.videoUrl}
                        />
                        {userInput.videoSrc ? (
                            isYoutubeUrl(userInput.videoSrc) ? (
                                <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
                                    <iframe
                                        title={userInput.title || 'YouTube preview'}
                                        src={toEmbedUrl(userInput.videoSrc)}
                                        className="w-full h-full"
                                        allowFullScreen
                                    />
                                </div>
                            ) : (
                                <video 
                                    muted
                                    src={userInput.videoSrc}
                                    controls 
                                    controlsList="nodownload nofullscreen"
                                    disablePictureInPicture
                                    className="object-fill rounded-tl-lg rounded-tr-lg w-full"
                                />
                            )
                        ) : (
                            <div className="h-48 border flex items-center justify-center cursor-pointer">
                                <label className="font-semibold text-cl cursor-pointer" htmlFor="lecture">Choose your video</label>
                                <input
                                    type="file"
                                    className="hidden" 
                                    id="lecture" 
                                    name="lecture" 
                                    onChange={handleVideo}
                                    accept="video/mp4 video/x-mp4 video/*" 
                                />
                            </div>
                        )}
                        <button type="submit" className="btn btn-primary py-1 font-semibold text-lg">
                            Add new Lecture
                        </button>
                    </form>
                </div>
            </div>  
        </HomeLayout>
    )
}
export default AddCourseLectures;