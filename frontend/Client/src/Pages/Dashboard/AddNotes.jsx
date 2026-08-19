import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { addCourseNote } from "../../Redux/Slices/CourseSlice";

function AddNotes() {
    const location = useLocation();
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const courseDetails = location.state;

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        noteUrl: "",
        noteFile: undefined,
    });

    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleFileChange(e) {
        const file = e.target.files?.[0];
        setFormData((prev) => ({ ...prev, noteFile: file }));
    }

    async function onFormSubmit(e) {
        e.preventDefault();
        const courseId = courseDetails?._id || courseDetails?.id || params.courseId;

        if (!courseId) {
            toast.error("Please open this page from the course dashboard.");
            return;
        }

        if (!formData.title || (!formData.description && !formData.noteUrl && !formData.noteFile)) {
            toast.error("Title and a note description or URL are required.");
            return;
        }

        const payload = { id: courseId, title: formData.title, description: formData.description, noteUrl: formData.noteUrl };
        if (formData.noteFile) payload.noteFile = formData.noteFile;

        const response = await dispatch(addCourseNote(payload));
        if (response?.payload?.success) {
            navigate(-1);
            setFormData({ title: "", description: "", noteUrl: "", noteFile: undefined });
        }
    }

    useEffect(() => {
        const resolvedId = courseDetails?._id || courseDetails?.id || params.courseId;
        if (!resolvedId) {
            toast.error("Please open this page from the course dashboard.");
            navigate("/admin/dashboard");
        }
    }, [courseDetails, params.courseId, navigate]);

    return (
        <HomeLayout>
            <div className="min-h-[90vh] text-white flex flex-col items-center justify-center gap-10 mx-5 sm:mx-16 md:mx-20">
                <div className="flex flex-col gap-5 p-2 shadow-[0_0_10px_black] w-[80vw] md:w-96 rounded-lg">
                    <header className="flex items-center justify-center relative">
                        <button
                            className="absolute left-2 text-2xl text-green-500"
                            onClick={() => navigate(-1)}
                        >
                            <AiOutlineArrowLeft />
                        </button>
                        <h1 className="text-xl text-yellow-500 font-semibold">Add new note</h1>
                    </header>

                    <form onSubmit={onFormSubmit} className="flex flex-col gap-3">
                        <input
                            type="text"
                            name="title"
                            placeholder="Enter note title"
                            onChange={handleInputChange}
                            className="bg-transparent px-3 py-1 border"
                            value={formData.title}
                        />
                        <textarea
                            name="description"
                            placeholder="Enter note description"
                            onChange={handleInputChange}
                            className="bg-transparent px-3 py-1 border resize-none overflow-y-scroll h-36"
                            value={formData.description}
                        />
                        <input
                            type="url"
                            name="noteUrl"
                            placeholder="Optional note link"
                            onChange={handleInputChange}
                            className="bg-transparent px-3 py-1 border"
                            value={formData.noteUrl}
                        />
                        <input
                            type="file"
                            name="noteFile"
                            accept=".pdf, .doc, .docx, .ppt, .pptx, application/pdf, application/msword, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation"
                            onChange={handleFileChange}
                            className="bg-transparent px-3 py-1 border"
                        />
                        <button type="submit" className="btn btn-primary py-1 font-semibold text-lg">
                            Add note
                        </button>
                    </form>
                </div>
            </div>
        </HomeLayout>
    );
}

export default AddNotes;
