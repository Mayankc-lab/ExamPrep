import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import axiosInstance from "../../Helper/axiosinstance"

const isBrowser = typeof window !== "undefined";

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const normalizeRole = (role) => {
  if (!role) return "";
  return String(role).toUpperCase();
};

const initialState = {
  isLoggedIn: isBrowser ? localStorage.getItem("isLoggedIn") === "true" : false,
  role: isBrowser ? normalizeRole(localStorage.getItem("role")) : "",
  data: isBrowser ? safeParse(localStorage.getItem("data"), {}) : {},
  token: isBrowser ? localStorage.getItem("token") : null,
};


export const creatAccount =createAsyncThunk("/auth/singup", async(data, thunkAPI)=>{
    try {
        const res = await axiosInstance.post("user/register", data);
        toast.success(res?.data?.message || "Account created successfully");
        return res.data;
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to create account";
        toast.error(message);
        return thunkAPI.rejectWithValue(message);
    }
})

export const login =createAsyncThunk("/auth/login", async(data, thunkAPI)=>{
    try {
        const res = await axiosInstance.post("user/login", data);
        toast.success(res?.data?.message || "Logged in successfully");
        return res.data;
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to login";
        toast.error(message);
        return thunkAPI.rejectWithValue(message);
    }
})

export const logout=createAsyncThunk("/auth/logout", async ()=>{
    try {
        const res =axiosInstance.post("user/logout");
        toast.promise(res,{
            loading:"wait logout in process..... ",
            success:(data)=>{
                return data?.data?.message;
            },
            error:"Failed to logout"
        })
        return(await res).data;

    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
})

export const updateProfile=createAsyncThunk("/user/update/profile", async ( data, thunkAPI)=>{
    try {
        const res = axiosInstance.put(`user/update`, data);
        toast.promise(res,{
            loading:"wait profile update in process..... ",
            success:(response)=>{
                return response?.data?.message;
            },
            error:"Failed to profile update"
        })
        return (await res).data;

    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to profile update";
        toast.error(message);
        return thunkAPI.rejectWithValue(message);
    }
})

export const getuserData=createAsyncThunk("/user/details", async (_, thunkAPI)=>{
    try {
        const res =axiosInstance.get("user/me");
        return(await res).data;
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to fetch profile";
        toast.error(message);
        return thunkAPI.rejectWithValue(message);
    }
})

export const forgetPassword =createAsyncThunk("/auth/forget-Password", async(data)=>{
    try {
        const res =axiosInstance.post("user/reset", data);
        toast.promise(res,{
            loading:"wait forgetPassword in process..... ",
            success:(data)=>{
                return data?.data?.message;
            },
            error:"Failed to forgetPassword"
        })
        return(await res).data;
        
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const changePassword = createAsyncThunk(
    "/auth/changePassword",
    async (userPassword) => {
        try {
        let res = axiosInstance.post("/user/change-password", userPassword);
        toast.promise(res,{
            loading:"wait  in process..... ",
            success:(data)=>{
                return data?.data?.message;
            },
            error:"Failed to change Password"
        })
        return(await res).data;
        } catch (error) {
        toast.error(error?.response?.data?.message);
        }
 });

export const resetPassword = createAsyncThunk("/user/reset", async (data) => {
    try {
        let res = axiosInstance.post(`/user/reset/${data.resetToken}`, { password: data.password });
        toast.promise(res,{
            loading:"wait  in process..... ",
            success:(data)=>{
                return data?.data?.message;
            },
            error:"Failed to reset Password"
        })
        return(await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(creatAccount.fulfilled, (state, action)=>{
            const user = action?.payload?.user || {};
            const role = normalizeRole(user?.role);
            localStorage.setItem("data", JSON.stringify(user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", role);
            state.data = user;
            state.role = role;
            state.isLoggedIn = true;

        })
        .addCase(login.fulfilled, (state, action)=>{
            const user = action?.payload?.user || {};
            const token = action?.payload?.token || null;
            const role = normalizeRole(user?.role);
            localStorage.setItem("data", JSON.stringify(user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", role);
            if (token) {
              localStorage.setItem("token", token);
              state.token = token;
            }
            state.data = user;
            state.role = role;
            state.isLoggedIn = true;

        })
        .addCase(logout.fulfilled, (state)=>{
            localStorage.clear();
            state.data={};
            state.isLoggedIn=false;
            state.role="";
            state.token=null;

        })
        .addCase(updateProfile.fulfilled, (state, action)=>{
            const user = action?.payload?.user || state.data;
            if(!user) return;
            const role = normalizeRole(user?.role);
            localStorage.setItem("data", JSON.stringify(user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", role);
            state.isLoggedIn=true;
            state.data=user;
            state.role=role;
        })
        .addCase(getuserData.fulfilled, (state, action)=>{
            const user = action?.payload?.user;
            if(!user) return;
            const role = normalizeRole(user?.role);
            localStorage.setItem("data", JSON.stringify(user));
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("role", role);
            state.isLoggedIn=true;
            state.data=user;
            state.role=role;

        })

    }
});

// export const {}= authSlice.actions;
export default authSlice.reducer;