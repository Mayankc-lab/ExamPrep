import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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

function Assinment() {
    const dispatch = useDispatch();
    const { courseData } = useSelector((state) => state.course);
    const coursesToShow = courseData?.length ? courseData : fallbackCourses;

    async function loadCourses() {
        await dispatch(getAllCourse());
    }

    useEffect(() => {
        loadCourses();
    }, []);

    return (
        <HomeLayout>
            <div className="min-h-[90vh] pt-12 flex flex-col gap-10 text-white">
                <h1 className="text-center text-3xl font-semibold">
                    Assinment
                </h1>
                <div className="grid xl:grid-cols-3 md:grid-cols-2 mx-auto gap-16 grid-cols-1 text-center mb-10">
                    {coursesToShow.map((element) => {
                        return <CourseCard key={element._id} data={element} />;
                    })}
                </div>
            </div>
        </HomeLayout>
    );
}

export default Assinment;
