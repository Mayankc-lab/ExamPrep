
import toast from "react-hot-toast";
import {useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { getuserData } from "../../Redux/Slices/AuthSlice";
import { cancelCourseBundle } from "../../Redux/Slices/RazorpaySlice";

function Profile(){

    const userData = useSelector((state)=>state?.auth?.data);
    const dispatch = useDispatch();
    const navigate=useNavigate();


     async function handleCancelation() {
        if(window.confirm("Are you Sure Want  Cancel Subscription ?")){
            toast("Initiating cancellation..")
            await dispatch(cancelCourseBundle());
            await dispatch(getuserData());
            toast.success("Cancellation completed!");
            navigate("/")
        }  
     }
    return (
        <HomeLayout>
                <div className="min-h-[90vh] flex items-center justify-center px-2">
                    <div className="my-10 flex flex-col gap-4 rounded-lg p-4 text-white w-[80vw] sm:w-96 shadow-[0_0_10px_black] overflow-hidden">
                        <img
                            className="w-40 m-auto rounded-full border border-black"
                            src={userData?.avatar?.secure_url}
                        />
                
                        <h3 className="text-xl font-semibold text-center capitalize break-words">
                            {userData?.fullName}
                        </h3>
                        <div className="grid grid-cols-2 gap-2 overflow-x-auto">
                            <p className="break-words">Email: </p><p className="break-words">{userData?.email}</p>
                            <p className="break-words">Role: </p><p className="break-words">{userData?.role}</p>
                            <p className="break-words">Subscription: </p><p className="break-words">{userData?.subscription?.status ==="active"?"Active":"Inactive"}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full">
                            <Link
                                to='/change-password'
                                className="w-full sm:w-1/2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out text-center duration-300 rounded-md font-semibold py-2 cursor-pointer px-2" >
                                        <button className="w-full break-words">Change password</button>
                            </Link>

                            <Link
                                to='/user/editprofile'
                                className="w-full sm:w-1/2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 text-center rounded-md font-semibold py-2 cursor-pointer px-2" >
                                        <button className="w-full break-words">Edit Profile</button>
                            </Link>
                        </div>
                        {userData?.subscription?.status ==='active' && (
                            <button onClick={handleCancelation} className="w-full bg-red-600 hover:bg-red-500 transition-all ease-in-out duration-300 rounded-sm font-semibold py-2 cursor-pointer px-2 break-words">
                                Cancel Subscription
                            </button>
                        )}
                    </div>
                </div>
        </HomeLayout>
        
        );
}
export default Profile;