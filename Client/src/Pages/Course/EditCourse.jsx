import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { updateCourse } from "../../Redux/Slices/CourseSlice";

  function EditCourse(){

    const dispatch =useDispatch();
    const navigate =useNavigate();
    const {state }=useLocation();
    // console.log(state)
    const [userInput, setUserInput]=useState({
        id:state?._id,
        title:state?.title,
        category:state?.category,
        description:state?.description,
        createdBy:state?.createdBy,
        thumbnail:null,
        previewImage:state.thumbnail?.secure_url,
        questions: state?.testQuestions?.length
            ? state.testQuestions
            : [
                {
                  question: "",
                  options: ["", "", "", ""],
                  answer: "",
                  explanation: ""
                }
              ]
    });

     function handleImageUpload(e){
        e.preventDefault();
        const uploadedImage=e.target.files[0];
        if(uploadedImage){
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function(){
                setUserInput({
                    ...userInput,
                    previewImage:this.result,
                    thumbnail:uploadedImage
                })
            })
        }
    }

    function parseQuestionCsv(csvText) {
        const rows = csvText
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

        if (rows.length < 2) return [];

        const headers = rows[0].split(",").map((header) => header.trim().toLowerCase());
        return rows.slice(1).map((row) => {
            const values = row.split(",").map((cell) => cell.trim());
            const question = {};
            headers.forEach((header, index) => {
                question[header] = values[index] || "";
            });

            const options = [
                question.option1 || "",
                question.option2 || "",
                question.option3 || "",
                question.option4 || ""
            ];

            return {
                question: question.question || "",
                options,
                answer: question.answer || "",
                explanation: question.explanation || ""
            };
        });
    }

    function handleQuestionFileUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target.result;
                let importedQuestions = [];

                if (file.name.endsWith(".json") || file.type === "application/json") {
                    const parsed = JSON.parse(text);
                    if (Array.isArray(parsed)) {
                        importedQuestions = parsed.map((item) => ({
                            question: item.question || "",
                            options: item.options?.length === 4 ? item.options : [item.option1 || "", item.option2 || "", item.option3 || "", item.option4 || ""],
                            answer: item.answer || "",
                            explanation: item.explanation || ""
                        }));
                    }
                } else {
                    importedQuestions = parseQuestionCsv(text);
                }

                if (!importedQuestions.length) {
                    toast.error("No questions found in the uploaded file.");
                    return;
                }

                setUserInput((prev) => ({
                    ...prev,
                    questions: [...prev.questions, ...importedQuestions]
                }));
                toast.success(`Imported ${importedQuestions.length} questions.`);
            } catch (error) {
                toast.error("Failed to import questions from file.");
            }
        };

        reader.readAsText(file);
    }

    function handleUserInput(e){
        e.preventDefault();
        const {name,value}=e.target;
       setUserInput({
            ...userInput,
            [name]:value
       })
    }

    async function OnFormSubmit(e){
        e.preventDefault();
        if(!userInput.title ||!userInput.description||!userInput.category ){
            toast.error("All fields are mandatory");
            return;
        }

        const response = await dispatch(updateCourse(userInput));
        if(response?.payload?.success){
            setUserInput({
                title:"",
                category:"",
                description:"",
                thumbnail:null,
            });
            navigate("/courses");
        }
    }
    return(
        <HomeLayout>
            <div className="flex justify-center min-h-[calc(100vh-15vh)] pt-10 pb-10">
                <form 
                    onSubmit={OnFormSubmit}
                    className="flex flex-col gap-5 rounded-lg p-4 mt-5 text-white w-[80vw] md:w-[700px] sm:my-10 relative shadow-[0_0_10px_black] min-h-[650px]"
                >
                    <div>
                        <Link to={"/"} className=" absolute left-2  text-lg text-accent cursor-pointer">
                            <AiOutlineArrowLeft/>
                        </Link>
                    </div>
            
                    <h1 className=" text-center text-2xl font-bold">
                        Edit Course
                    </h1>

                    <main className=" grid lg:grid-cols-2 grid-cols-1 gap-x-10">
                        <div>
                            <div>
                                <label htmlFor="image_uploads" className="  cursor-pointer">
                                        {userInput.previewImage ? (
                                            <img 
                                                className=" w-full h-44 m-auto border"
                                                src={userInput.previewImage}
                                            />
                                        ):(
                                            <div className=" w-full h-44 m-auto flex items-center justify-center border">
                                                <h1 className=" font-bold text-lg">  Upload your course thumbnail</h1>
                                            </div>
                                        ) }
                                </label>
                                <input
                                    className="hidden"
                                    type="file"
                                    id="image_uploads"
                                    accept=".jpg, .jpeg, .png"
                                    name="image_uploads"
                                    onChange={handleImageUpload}
                                />
                            </div>
                                   
                            <div className=" flex  flex-col gap-1">
                                <label className=" text-lg font-semibold" htmlFor="title">
                                            Course title
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="Enter course title"
                                    className="bg-transparent px-2 py-1 border"
                                    value={userInput.title}
                                    onChange={handleUserInput}
                                />
                            </div>   
                        </div >

                        <div className="flex flex-col gap-1">
                            <div className=" flex  flex-col gap-1">
                                <label className=" text-lg font-semibold" htmlFor="createdBy">
                                        Course Instructor
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="createdBy"
                                    id="createdBy"
                                    placeholder="Enter course instructor"
                                    className="bg-transparent px-2 py-1 border"
                                    value={userInput.createdBy}
                                    onChange={handleUserInput}
                                />
                            </div>  
                            <div className=" flex  flex-col gap-1">
                                <label className=" text-lg font-semibold" htmlFor="category">
                                        Course category
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="category"
                                    id="category"
                                    placeholder="Enter course category"
                                    className="bg-transparent px-2 py-1 border"
                                    value={userInput.category}
                                    onChange={handleUserInput}
                                />
                            </div>      
                            <div className=" flex  flex-col gap-1">
                                <label className=" text-lg font-semibold" htmlFor="description">
                                        Course description
                                </label>
                                <textarea
                                    required
                                    type="text"
                                    name="description"
                                    id="description"
                                    placeholder="Enter course description"
                                    className="bg-transparent px-2 py-1  h-24 overflow-scroll resize-none border"
                                    value={userInput.description}
                                    onChange={handleUserInput}
                                />
                            </div>        
                        </div>
                    </main>

                    <div className="space-y-6">
                        <div className="space-y-4 border border-slate-700 rounded-md p-4 bg-slate-950/30">
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <h2 className="text-xl font-semibold">Test Questions</h2>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUserInput((prev) => ({
                                                ...prev,
                                                questions: [
                                                    ...prev.questions,
                                                    {
                                                        question: "",
                                                        options: ["", "", "", ""],
                                                        answer: "",
                                                        explanation: ""
                                                    }
                                                ]
                                            }))
                                        }}
                                        className="rounded-md bg-yellow-600 px-4 py-2 text-sm font-semibold hover:bg-yellow-500"
                                    >
                                        Add question
                                    </button>
                                    <label className="cursor-pointer rounded-md bg-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-600">
                                        Import CSV/JSON
                                        <input
                                            type="file"
                                            accept=".csv,application/json,text/csv"
                                            className="hidden"
                                            onChange={handleQuestionFileUpload}
                                        />
                                    </label>
                                </div>
                            </div>
                            {userInput.questions.map((question, idx) => (
                                <div key={idx} className="space-y-3 rounded border border-slate-700 bg-slate-900/80 p-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="font-semibold">Question {idx + 1}</p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setUserInput((prev) => ({
                                                    ...prev,
                                                    questions: prev.questions.filter((_, index) => index !== idx)
                                                }))
                                            }}
                                            className="rounded-md bg-red-600 px-3 py-1 text-sm font-semibold hover:bg-red-500"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium">Question text</label>
                                        <input
                                            type="text"
                                            name="question"
                                            value={question.question}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setUserInput((prev) => {
                                                    const next = [...prev.questions];
                                                    next[idx] = { ...next[idx], question: value };
                                                    return { ...prev, questions: next };
                                                });
                                            }}
                                            className="w-full rounded border border-slate-600 bg-transparent px-3 py-2"
                                        />
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {question.options.map((option, optionIndex) => (
                                            <div key={optionIndex} className="space-y-1">
                                                <label className="block text-sm font-medium">Option {optionIndex + 1}</label>
                                                <input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setUserInput((prev) => {
                                                            const next = [...prev.questions];
                                                            const questionCopy = { ...next[idx] };
                                                            const optionsCopy = [...questionCopy.options];
                                                            optionsCopy[optionIndex] = value;
                                                            questionCopy.options = optionsCopy;
                                                            next[idx] = questionCopy;
                                                            return { ...prev, questions: next };
                                                        });
                                                    }}
                                                    className="w-full rounded border border-slate-600 bg-transparent px-3 py-2"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium">Correct answer</label>
                                            <select
                                                value={question.answer}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setUserInput((prev) => {
                                                        const next = [...prev.questions];
                                                        next[idx] = { ...next[idx], answer: value };
                                                        return { ...prev, questions: next };
                                                    });
                                                }}
                                                className="w-full rounded border border-slate-600 bg-transparent px-3 py-2"
                                            >
                                                <option value="">Select correct option</option>
                                                {question.options.map((option, optionIndex) => (
                                                    <option key={optionIndex} value={option}>{option || `Option ${optionIndex + 1}`}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium">Explanation</label>
                                            <textarea
                                                value={question.explanation}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setUserInput((prev) => {
                                                        const next = [...prev.questions];
                                                        next[idx] = { ...next[idx], explanation: value };
                                                        return { ...prev, questions: next };
                                                    });
                                                }}
                                                className="w-full rounded border border-slate-600 bg-transparent px-3 py-2 resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="w-full bg-yellow-600 text-lg hover:bg-yellow-500 transition-all duration-300 ease-in-out py-2 rounded-sm font-semibold">
                            Update Course
                        </button>
                    </div>

                </form>
            </div>
        </HomeLayout>  
    )
}
export default EditCourse;