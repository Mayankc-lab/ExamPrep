import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";

const subjectQuestions = {
    Science: [
        {
            id: 1,
            question: "What is the boiling point of water at standard pressure?",
            options: ["90°C", "100°C", "120°C", "80°C"],
            answer: "100°C",
            explanation: "Water boils at 100°C under standard atmospheric pressure."
        },
        {
            id: 2,
            question: "Which organ system transports oxygen in the body?",
            options: ["Nervous", "Circulatory", "Digestive", "Respiratory"],
            answer: "Circulatory",
            explanation: "The circulatory system carries oxygen using the blood."
        },
        {
            id: 3,
            question: "What is the force that pulls objects toward Earth?",
            options: ["Magnetism", "Friction", "Gravity", "Electricity"],
            answer: "Gravity",
            explanation: "Gravity is the pull between masses, like objects and Earth."
        }
    ],
    Chemistry: [
        {
            id: 1,
            question: "What is the chemical formula for water?",
            options: ["CO2", "H2O", "O2", "NaCl"],
            answer: "H2O",
            explanation: "Water is made of two hydrogen atoms and one oxygen atom."
        },
        {
            id: 2,
            question: "Which gas is produced by baking soda and vinegar?",
            options: ["Oxygen", "Hydrogen", "Carbon dioxide", "Nitrogen"],
            answer: "Carbon dioxide",
            explanation: "The reaction produces carbon dioxide gas as the mixture fizzes."
        },
        {
            id: 3,
            question: "What is the pH of a neutral solution?",
            options: ["1", "7", "14", "10"],
            answer: "7",
            explanation: "A pH of 7 indicates a neutral solution like pure water."
        }
    ],
    Mathematics: [
        {
            id: 1,
            question: "What is 8 × 7?",
            options: ["54", "56", "64", "48"],
            answer: "56",
            explanation: "8 times 7 equals 56."
        },
        {
            id: 2,
            question: "What is the perimeter of a square with side 5?",
            options: ["20", "10", "25", "15"],
            answer: "20",
            explanation: "Perimeter is 4 × side length, so 4 × 5 = 20."
        },
        {
            id: 3,
            question: "What is 12 ÷ 3?",
            options: ["4", "6", "3", "9"],
            answer: "4",
            explanation: "12 divided by 3 equals 4."
        }
    ],
    Language: [
        {
            id: 1,
            question: "Which word is a noun?",
            options: ["Run", "Happy", "School", "Quickly"],
            answer: "School",
            explanation: "A noun names a person, place, thing, or idea."
        },
        {
            id: 2,
            question: "Choose the correct past tense of 'go'.",
            options: ["Goed", "Went", "Goes", "Gone"],
            answer: "Went",
            explanation: "The past tense of go is went."
        },
        {
            id: 3,
            question: "Which sentence is a question?",
            options: ["She likes apples.", "Do you like apples?", "He eats apples.", "Apples are sweet."],
            answer: "Do you like apples?",
            explanation: "A question asks something and ends with a question mark."
        }
    ],
    Aptitude: [
        {
            id: 1,
            question: "If 3 pens cost 15 rupees, how much does 1 pen cost?",
            options: ["3", "4", "5", "6"],
            answer: "5",
            explanation: "15 divided by 3 equals 5 rupees per pen."
        },
        {
            id: 2,
            question: "Which number completes the series: 2, 4, 6, __?",
            options: ["7", "8", "9", "10"],
            answer: "8",
            explanation: "This is an even-number sequence increasing by 2."
        },
        {
            id: 3,
            question: "What is 30% of 200?",
            options: ["50", "60", "70", "80"],
            answer: "60",
            explanation: "30% of 200 is 0.3 × 200 = 60."
        }
    ],
    Reasoning: [
        {
            id: 1,
            question: "Which number does not belong: 2, 4, 9, 8?",
            options: ["2", "4", "9", "8"],
            answer: "9",
            explanation: "9 is the only odd number in the list."
        },
        {
            id: 2,
            question: "If all roses are flowers and some flowers fade quickly, can some roses fade quickly?",
            options: ["Yes", "No", "Only if red", "Cannot say"],
            answer: "Yes",
            explanation: "Since roses are flowers, the subset can also include those that fade quickly."
        },
        {
            id: 3,
            question: "Which shape has 4 equal sides and 4 right angles?",
            options: ["Rectangle", "Rhombus", "Square", "Trapezoid"],
            answer: "Square",
            explanation: "A square has equal sides and right angles."
        }
    ],
    "General Studies": [
        {
            id: 1,
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Earth", "Mars", "Jupiter"],
            answer: "Mars",
            explanation: "Mars is often called the Red Planet because of its reddish surface."
        },
        {
            id: 2,
            question: "Who is the Prime Minister of India?",
            options: ["Narendra Modi", "Amit Shah", "Rahul Gandhi", "Arvind Kejriwal"],
            answer: "Narendra Modi",
            explanation: "Narendra Modi is the current Prime Minister of India."
        },
        {
            id: 3,
            question: "What do we call the study of weather?",
            options: ["Geology", "Biology", "Astronomy", "Meteorology"],
            answer: "Meteorology",
            explanation: "Meteorology is the science of weather and atmosphere."
        }
    ]
};

const defaultQuestions = [
    {
        id: 1,
        question: "What is the capital of India?",
        options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
        answer: "New Delhi",
        explanation: "New Delhi is the capital city of India."
    },
    {
        id: 2,
        question: "Which shape has three sides?",
        options: ["Square", "Triangle", "Circle", "Rectangle"],
        answer: "Triangle",
        explanation: "A triangle has three sides."
    },
    {
        id: 3,
        question: "Which animal is known as the king of the jungle?",
        options: ["Tiger", "Elephant", "Lion", "Giraffe"],
        answer: "Lion",
        explanation: "The lion is commonly called the king of the jungle."
    }
];

function getQuestionsForCourse(title, category) {
    const lowerTitle = title?.toLowerCase() || "";
    const key = category || title;

    if (subjectQuestions[key]) {
        return subjectQuestions[key];
    }

    if (lowerTitle.includes("physics") || lowerTitle.includes("chemistry") || lowerTitle.includes("science")) {
        return subjectQuestions.Science;
    }
    if (lowerTitle.includes("math") || lowerTitle.includes("algebra") || lowerTitle.includes("geometry")) {
        return subjectQuestions.Mathematics;
    }
    if (lowerTitle.includes("english") || lowerTitle.includes("language") || lowerTitle.includes("grammar")) {
        return subjectQuestions.Language;
    }
    if (lowerTitle.includes("aptitude") || lowerTitle.includes("reasoning")) {
        return subjectQuestions.Aptitude;
    }
    if (lowerTitle.includes("general") || lowerTitle.includes("awareness")) {
        return subjectQuestions["General Studies"];
    }
    if (lowerTitle.includes("reasoning") || lowerTitle.includes("logical") || lowerTitle.includes("puzzle")) {
        return subjectQuestions.Reasoning;
    }

    return defaultQuestions;
}

function TestPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [activeQuestion, setActiveQuestion] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [submittedQuestions, setSubmittedQuestions] = useState({});

    const courseTitle = location?.state?.title || "Course Test";
    const questions = location?.state?.testQuestions?.length
        ? location.state.testQuestions
        : getQuestionsForCourse(location?.state?.title, location?.state?.category);
    const currentQuestion = questions[activeQuestion];
    const selectedOption = selectedOptions[activeQuestion];
    const isSubmitted = Boolean(submittedQuestions[activeQuestion]);
    const isCorrect = isSubmitted && selectedOption === currentQuestion.answer;

    const handleOptionSelect = (option) => {
        setSelectedOptions((prev) => ({ ...prev, [activeQuestion]: option }));
    };

    const handleSubmit = () => {
        setSubmittedQuestions((prev) => ({ ...prev, [activeQuestion]: true }));
    };

    const handleClear = () => {
        setSelectedOptions((prev) => ({ ...prev, [activeQuestion]: undefined }));
        setSubmittedQuestions((prev) => ({ ...prev, [activeQuestion]: false }));
    };

    return (
        <HomeLayout>
            <div className="min-h-[90vh] px-4 py-12 text-white flex items-center justify-center">
                <div className="w-full max-w-3xl rounded-lg border border-slate-700 bg-slate-900/70 p-6 shadow-[0_0_10px_black] md:p-8">
                    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-yellow-500">Test for {courseTitle}</h1>
                            <p className="mt-1 text-sm text-slate-300">Tap a number to switch questions and submit your answer.</p>
                        </div>
                        <button
                            onClick={() => navigate(-1)}
                            className="rounded-md bg-slate-700 px-4 py-2 font-semibold transition-all hover:bg-slate-600"
                        >
                            Back
                        </button>
                    </div>

                    <div className="mb-8 flex flex-wrap gap-3">
                        {questions.map((question, index) => (
                            <button
                                key={question.id}
                                onClick={() => setActiveQuestion(index)}
                                className={`flex h-12 w-12 items-center justify-center rounded-full border font-semibold transition-all ${
                                    activeQuestion === index
                                        ? "border-yellow-500 bg-yellow-600 text-white"
                                        : "border-slate-600 bg-slate-800 text-slate-200 hover:border-yellow-400"
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <div className="rounded-lg border border-slate-700 bg-slate-800/70 p-5">
                        <p className="mb-4 text-xl font-semibold">
                            {activeQuestion + 1}. {currentQuestion.question}
                        </p>

                        <div className="space-y-3">
                            {currentQuestion.options.map((option) => {
                                const isSelected = selectedOption === option;
                                return (
                                    <button
                                        key={option}
                                        onClick={() => handleOptionSelect(option)}
                                        className={`w-full rounded-md border px-4 py-3 text-left transition-all ${
                                            isSelected
                                                ? "border-yellow-500 bg-yellow-600/20 text-yellow-200"
                                                : "border-slate-600 bg-slate-900/70 text-slate-100 hover:border-yellow-400"
                                        }`}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                onClick={handleSubmit}
                                className="rounded-md bg-yellow-600 px-4 py-2 font-semibold transition-all hover:bg-yellow-500"
                            >
                                Submit
                            </button>
                            <button
                                onClick={handleClear}
                                className="rounded-md border border-slate-600 px-4 py-2 font-semibold transition-all hover:border-yellow-400"
                            >
                                Clear
                            </button>
                        </div>

                        {isSubmitted && (
                            <div className={`mt-6 rounded-lg border p-4 ${isCorrect ? "border-green-500 bg-green-900/30" : "border-red-500 bg-red-900/30"}`}>
                                <p className="font-semibold">{isCorrect ? "Correct!" : "Not quite right."}</p>
                                <p className="mt-2">
                                    <span className="text-yellow-400">Answer:</span> {currentQuestion.answer}
                                </p>
                                <p className="mt-2 text-sm text-slate-200">{currentQuestion.explanation}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}

export default TestPage;
