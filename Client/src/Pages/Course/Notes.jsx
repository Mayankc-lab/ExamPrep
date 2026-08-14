import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import CourseCard from "../../Components/CourseCard";
import HomeLayout from "../../Layouts/HomeLayout";
import { getAllCourse } from "../../Redux/Slices/CourseSlice";

const fallbackCourses = [
    {
        _id: "64867f1d7d2e8c5bc1a7f001",
        title: "Physics",
        description: "Learn the fundamentals of motion, energy, and scientific problem-solving with engaging lessons.",
        category: "Science",
        createdBy: "Dr. Asha Kumar",
        thumbnail: {
            secure_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
        }
    },
    {
        _id: "64867f1d7d2e8c5bc1a7f002",
        title: "Chemistry",
        description: "Explore atoms, reactions, and practical lab concepts through clear and structured modules.",
        category: "Science",
        createdBy: "Prof. Neha Singh",
        thumbnail: {
            secure_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
        }
    },
    {
        _id: "64867f1d7d2e8c5bc1a7f003",
        title: "Maths",
        description: "Master algebra, geometry, and problem-solving techniques with step-by-step guidance.",
        category: "Mathematics",
        createdBy: "Mr. Rahul Verma",
        thumbnail: {
            secure_url: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=800&q=80"
        }
    }
];

function Notes() {
    const dispatch = useDispatch();
    const { courseData } = useSelector((state) => state.course);
    const { state } = useLocation();
    const { courseSlug } = useParams();

    const coursesToShow = courseData?.length ? courseData : fallbackCourses;
    const isCourseDetail = Boolean(courseSlug && state?.title);

    async function loadCourses() {
        await dispatch(getAllCourse());
    }

    useEffect(() => {
        loadCourses();
    }, []);

    const pageTitle = isCourseDetail
        ? `${state.title} Assinment & Notes`
        : "Assinment & Notes";

    const navigate = useNavigate();

    const displayCourses = isCourseDetail ? [state] : coursesToShow;

    return (
        <HomeLayout>
            <div className="min-h-[90vh] pt-12 flex flex-col gap-10 text-white">
                <h1 className="text-center text-3xl font-semibold">
                    {pageTitle}
                </h1>
                <div className="grid xl:grid-cols-3 md:grid-cols-2 mx-auto gap-16 grid-cols-1 text-center mb-10">
                    {displayCourses.map((element) => {
                        const slug = element?.title?.toLowerCase()?.replace(/\s+/g, "_") || "course";
                        const targetPath = `/course/${slug}_assinment&notes`;

                        return (
                            <div key={element._id} className="flex flex-col gap-4 items-center">
                                <CourseCard
                                    data={element}
                                    linkBase={isCourseDetail ? undefined : "/course"}
                                    linkSuffix={isCourseDetail ? undefined : "_assinment&notes"}
                                />

                                {isCourseDetail ? (
                                    <div className="w-[20rem] mt-2 rounded-lg border border-yellow-500/40 bg-black/30 p-3 text-left">
                                        <div className="mb-2">
                                            <p className="text-sm font-semibold text-yellow-500">Notes</p>
                                        </div>

                                        {element?.notes?.length ? (
                                            <ul className="space-y-2 text-sm text-slate-200">
                                                {element.notes.slice(0, 3).map((note, index) => (
                                                    <li key={`${element._id}-${index}`} className="rounded border border-white/10 p-2 flex justify-between items-center">
                                                        <div>
                                                            <p className="font-semibold text-white">{note.title}</p>
                                                            {note.description ? (
                                                                <p className="text-xs text-slate-400">{note.description}</p>
                                                            ) : null}
                                                        </div>

                                                        {note?.file?.secure_url ? (
                                                            <a
                                                                href={note.file.secure_url}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="ml-3 text-xs bg-yellow-500 text-black px-2 py-1 rounded font-semibold"
                                                            >
                                                                Open
                                                            </a>
                                                        ) : (
                                                            <button
                                                                onClick={() => navigate(targetPath, { state: { ...element } })}
                                                                className="ml-3 text-xs bg-yellow-500 text-black px-2 py-1 rounded font-semibold"
                                                            >
                                                                Open
                                                            </button>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-xs text-slate-400">No notes added yet.</p>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </div>
        </HomeLayout>
    );
}

export default Notes;
