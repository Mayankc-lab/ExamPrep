import {model , Schema} from "mongoose";

/**
 * @courseSchema - Mongoose schema for Course.
 * This schema defines the structure and validation rules for course data, including title, description, category, thumbnail, lectures, and metadata.
 */

const courseSchema = new Schema({
    title:{
        type:String,
        required:[true, "Title is required" ],
        minLength:[4, "Title must be atleast 4 characters"],
        maxLength:[60,"Title should be less than 60 characters"],
        trim:true
    },
    description:{
        type: String,
        required:[true, "Description is required" ],
        minLength:[8, "Description must be atleast 8 characters"],
        maxLength:[200,"Description should be less than 200 characters"],
        trim:true
    },
    category:{
        type:String,
        required:[true, "Category is required" ],
    },
    thumbnail:{
        public_id:{
            type:String,
            required:true,
        },
        secure_url:{
            type:String,
            required:true,
        }
    },
    lectures:[
        {
            title:String,
            description:String,
            lecture:{
                public_id:{
                    type:String,
                },
                secure_url:{
                    type:String,
                    required:true,
                }
            }
        }
    ],
    notes:[
        {
            title:{
                type:String,
                required:true,
                trim:true,
            },
            description:{
                type:String,
                required:true,
                trim:true,
            },
            noteUrl:{
                type:String,
                trim:true,
                default:"",
            },
            file: {
                public_id: { type: String },
                secure_url: { type: String },
                original_name: { type: String },
                resource_type: { type: String },
            },
            addedBy:{
                type:String,
                trim:true,
                default:"ADMIN",
            },
            createdAt:{
                type:Date,
                default:Date.now,
            }
        }
    ],
    testQuestions:[
        {
            question: { type:String, trim:true },
            options:[
                {
                    type:String,
                    trim:true
                }
            ],
            answer: { type:String, trim:true },
            explanation: { type:String, trim:true }
        }
    ],
    numberOfLectures:{
        type:Number,
        default:0,
    },
    createdBy:{
        type:String,
        required:true,
    },
    liveSession:{
        isLive:{
            type:Boolean,
            default:false
        },
        youtubeUrl:{
            type:String,
            default:""
        },
        startedAt:{
            type:Date,
            default:null
        },
        title:{
            type:String,
            default:""
        },
        description:{
            type:String,
            default:""
        }
    }

},{
    timestamps:true
})

const Course = model('Course', courseSchema);

export default Course;