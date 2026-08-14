import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast";

import axiosInstance from "../../Helper/axiosinstance";

const initialState ={
    courseData: []
}

export const getAllCourse = createAsyncThunk("/course/get", async ()=>{
    try {
        const response=axiosInstance.get("/course");
        toast.promise(response, {
            loading:"loading course data ...",
            success:"courses loaded sucessfully",
            error:"Failed to get the courses",
        });
        return (await response).data.courses;
    } catch (error) {
        toast.error(error?.response?.data?.message);    
    }
})

export const createNewCourse= createAsyncThunk("/course/create", async(data)=>{
    try {
        let fromData = new FormData();
        fromData.append("title",data?.title);
        fromData.append("description",data?.description);
        fromData.append("category",data?.category);
        fromData.append("createdBy",data?.createdBy);
        fromData.append("thumbnail",data?.thumbnail);

        const response=axiosInstance.post("/course", fromData);
        toast.promise(response,{
            loading:"Creating new course",
            success:"Course created sucessfully",
            error:"Failed to create course"
        });

        return (await response).data;
        
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const deleteCourse = createAsyncThunk("/course/delete", async (data)=>{
    try {
        const id = data.id || data; // Support both id string and {id, adminPassword} object
        const adminPassword = data.adminPassword || "";
        
        const response=axiosInstance.delete(`/course/${id}`, {
            data: { adminPassword }
        });
        toast.promise(response, {
            loading:"deleting course data ...",
            success:"course deleted sucessfully",
            error:"Failed to delete the course",
        });
        return (await response).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);    
    }
})

export const addCourseNote = createAsyncThunk("/course/note/add", async (data)=>{
    try {
        let response;
        if (data.noteFile) {
            const formData = new FormData();
            formData.append('title', data.title || '');
            formData.append('description', data.description || '');
            formData.append('noteUrl', data.noteUrl || '');
            formData.append('noteFile', data.noteFile);

            response = axiosInstance.post(`/course/${data.id}/notes`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } else {
            response = axiosInstance.post(`/course/${data.id}/notes`, {
                title: data.title,
                description: data.description,
                noteUrl: data.noteUrl,
            });
        }

        toast.promise(response, {
            loading:"Adding course note...",
            success:"Note added successfully",
            error:"Failed to add the note",
        });

        return (await response).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const updateCourse = createAsyncThunk("/course/update", async (data) => {
    try {
      // creating the form data from user data
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("category", data.category);
      formData.append("createdBy", data.createdBy);
      formData.append("description", data.description);
      if (data.questions) {
        formData.append("questions", JSON.stringify(data.questions));
      }
      // backend is not allowing change of thumbnail
      if (data.thumbnail) {
        formData.append("thumbnail", data.thumbnail);
      }
  
      const res = axiosInstance.put(`/course/${data.id}`, {
        title: data.title,
        category: data.category,
        createdBy: data.createdBy,
        description: data.description,
        testQuestions: data.questions || []
      });
  
      toast.promise(res, {
        loading: "Updating the course...",
        success: "Course updated successfully",
        error: "Failed to update course",
      });
  
      const response = await res;
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  });

export const startLiveSession = createAsyncThunk("/course/live/start", async (data) => {
  try {
    const response = axiosInstance.post(`/course/${data.courseId}/live/start`, {
      youtubeUrl: data.youtubeUrl,
      title: data.title,
      description: data.description,
    });

    toast.promise(response, {
      loading: "Starting live session...",
      success: "Live session started successfully!",
      error: "Failed to start live session",
    });

    return (await response).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

export const endLiveSession = createAsyncThunk("/course/live/end", async (courseId) => {
  try {
    const response = axiosInstance.post(`/course/${courseId}/live/end`);

    toast.promise(response, {
      loading: "Ending live session...",
      success: "Live session ended successfully!",
      error: "Failed to end live session",
    });

    return (await response).data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

export const getLiveSession = createAsyncThunk("/course/live/get", async (courseId) => {
  try {
    const response = axiosInstance.get(`/course/${courseId}/live`);
    return (await response).data;
  } catch (error) {
    console.log(error);
  }
});

const courseSlice =createSlice({
    name :"course",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getAllCourse.fulfilled,(state, action)=>{
            if(action.payload){
                state.courseData=[...action.payload]
            }
        })
        .addCase(addCourseNote.fulfilled,(state, action)=>{
            if(action.payload?.notes && action.meta.arg?.id){
                state.courseData = state.courseData.map((course) => (
                    course._id === action.meta.arg.id
                        ? { ...course, notes: action.payload.notes }
                        : course
                ));
            }
        })
    } 
});

export default courseSlice.reducer;