import { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux"

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
        },
        lectures: [
            {
                _id: "64867f1d7d2e8c5bc1a7f011",
                title: "Physics Intro",
                description: "Start with an overview of motion, forces, and energy.",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                }
            },
            {
                _id: "64867f1d7d2e8c5bc1a7f019",
                title: "First Topic",
                description: "motion",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
                }
            },
            {
                _id: "64867f1d7d2e8c5bc1a7f020",
                title: "topic",
                description: "forces",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                }
            },
            {
                _id: "64867f1d7d2e8c5bc1a7f021",
                title: "topic",
                description: "energy",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
                }
            }
        ]
    },
    {
        _id: "64867f1d7d2e8c5bc1a7f002",
        title: "Chemistry",
        description: "Explore atoms, reactions, and practical lab concepts through clear and structured modules.",
        category: "Science",
        createdBy: "Prof. Neha Singh",
        thumbnail: {
            secure_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80"
        },
        lectures: [
            {
                _id: "64867f1d7d2e8c5bc1a7f012",
                title: "Chemistry Intro",
                description: "Get introduced to atoms, molecules, and chemical reactions.",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
                }
            },
            {
                _id: "64867f1d7d2e8c5bc1a7f022",
                title: "topic",
                description: "atoms",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                }
            },
            {
                _id: "64867f1d7d2e8c5bc1a7f023",
                title: "topic",
                description: "molecules",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
                }
            },
            {
                _id: "64867f1d7d2e8c5bc1a7f024",
                title: "topic",
                description: "chemical reactions",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4"
                }
            }
        ]
    },
    {
        _id: "64867f1d7d2e8c5bc1a7f003",
        title: "Maths",
        description: "Master algebra, geometry, and problem-solving techniques with step-by-step guidance.",
        category: "Mathematics",
        createdBy: "Mr. Rahul Verma",
        thumbnail: {
            secure_url: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=800&q=80"
        },
        lectures: [
            {
                _id: "64867f1d7d2e8c5bc1a7f013",
                title: "Maths Intro",
                description: "Review core arithmetic and algebra concepts.",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
                }
            },
            {
                _id: "64867f1d7d2e8c5bc1a7f025",
                title: "topic",
                description: "core arithmetic",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
                }
            },
            {
                _id: "64867f1d7d2e8c5bc1a7f026",
                title: "topic",
                description: "algebra concepts",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
                }
            }
        ]
    },
    {
        _id: "64867f1d7d2e8c5bc1a7f004",
        title: "General Awareness",
        description: "Stay updated with current affairs, important events, and everyday knowledge topics.",
        category: "General Studies",
        createdBy: "Ms. Priya Sharma",
        thumbnail: {
            secure_url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80"
        },
        lectures: [
            {
                _id: "64867f1d7d2e8c5bc1a7f014",
                title: "Awareness Intro",
                description: "Understand the basics of general knowledge and current events.",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
                }
            },
            {
                _id: "64867f1d7d2e8c5bc1a7f027",
                title: "topic",
                description: "basics of general knowledge",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                }
            },
            {
                _id: "64867f1d7d2e8c5bc1a7f028",
                title: "topic",
                description: "current events",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
                }
            }
        ]
    },
    {
        _id: "64867f1d7d2e8c5bc1a7f005",
        title: "Quantitative Aptitude",
        description: "Build strong calculation, data interpretation, and numerical reasoning skills.",
        category: "Aptitude",
        createdBy: "Mr. Sandeep Rao",
        thumbnail: {
            secure_url: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80"
        },
        lectures: [
            {
                _id: "64867f1d7d2e8c5bc1a7f015",
                title: "Quantitative Aptitude Intro",
                description: "Practice numerical and logical reasoning questions.",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
                }
            },
            {
                _id: "64867f1d7d2e8c5bc1a7f029",
                title: "topic",
                description: "Practice numerical and logical reasoning questions.",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                }
            },
            {
                _id: "64867f1d7d2e8c5bc1a7f030",
                title: "topic",
                description: "Practice numerical and logical reasoning questions.",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4"
                }
            }
        ]
    },
    {
        _id: "64867f1d7d2e8c5bc1a7f006",
        title: "Reasoning Ability",
        description: "Improve puzzle-solving, logical deduction, and analytical thinking with practical lessons.",
        category: "Reasoning",
        createdBy: "Mrs. Kavita Mehra",
        thumbnail: {
            secure_url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80"
        },
        lectures: [
            {
                _id: "64867f1d7d2e8c5bc1a7f016",
                title: "Reasoning Intro",
                description: "Develop analytical reasoning and critical thinking skills.",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4"
                }
            },
            {
                _id: "64867f1d7d2e8c5bc1a7f031",
                title: "topic",
                description: "Develop analytical reasoning",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
                }
            },
            {
                _id: "64867f1d7d2e8c5bc1a7f032",
                title: "topic",
                description: "critical thinking skills",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
                }
            }
        ]
    },
    {
        _id: "64867f1d7d2e8c5bc1a7f007",
        title: "English Language",
        description: "Enhance grammar, vocabulary, comprehension, and communication skills with guided practice.",
        category: "Language",
        createdBy: "Ms. Anjali Nair",
        thumbnail: {
            secure_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
        },
        lectures: [
            {
                _id: "64867f1d7d2e8c5bc1a7f017",
                title: "English Intro",
                description: "Strengthen vocabulary and grammar fundamentals.",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
                }
            },
            {
                _id: "64867f1d7d2e8c5bc1a7f033",
                title: "topic",
                description: "Strengthen vocabulary",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
                }
            },
            {
                _id: "64867f1d7d2e8c5bc1a7f034",
                title: "topic",
                description: "grammar fundamentals.",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
                }
            }
        ]
    },
    {
        _id: "64867f1d7d2e8c5bc1a7f008",
        title: "General Science",
        description: "Understand core scientific principles across biology, chemistry, and physics in a simple format.",
        category: "Science",
        createdBy: "Dr. Raghav Iyer",
        thumbnail: {
            secure_url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80"
        },
        lectures: [
            {
                _id: "64867f1d7d2e8c5bc1a7f018",
                title: "Science Intro",
                description: "Overview of basic science concepts for everyday learners.",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                }
            },
            {
                _id: "64867f1d7d2e8c5bc1a7f035",
                title: "topic",
                description: "basic science",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                }
            },
            {
                _id: "64867f1d7d2e8c5bc1a7f036",
                title: "topic",
                description: "concepts for everyday learners",
                lecture: {
                    secure_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
                }
            }
        ]
    }
];

function CourseList(){

    const dispatch = useDispatch()
    const {courseData}= useSelector((state)=>state.course);
    const coursesToShow = courseData?.length ? courseData : fallbackCourses;

   async function loadCourses(){
         await dispatch(getAllCourse());
    }
    useEffect(()=>{
        loadCourses();
    },[]);
    return (
        <HomeLayout>
           <div className=" min-h-[90vh]   pt-12  flex flex-col gap-10 text-white">
                <h1 className="text-center text-3xl  font-semibold">
                    Explore the course made by 
                    <span className=" font-bold text-yellow-500">
                        Industry experts
                    </span>
                </h1>



                <div className=" grid xl:grid-cols-3 md:grid-cols-2 mx-auto  gap-16 grid-cols-1 text-center mb-10">
                    {coursesToShow.map((element)=>{
                        return <CourseCard key={element._id} data={element}/>
                    })}
                </div>
             
           </div>

        </HomeLayout>
    )
}
export default CourseList;