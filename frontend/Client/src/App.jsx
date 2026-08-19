import { Route, Routes } from 'react-router-dom'

import './App.css'

import RequireAuth from './Components/Auth/RequireAuth.jsx'
import AboutUs from './Pages/AboutUs.jsx'
import AddCourseLectures from './Pages/Dashboard/AddLectures.jsx'
import AddNotes from './Pages/Dashboard/AddNotes.jsx'
import AdminDeshboard from './Pages/Dashboard/AdminDeshboard.jsx'
import ChangePassword from './Pages/Password/ChangePassword.jsx'
import CheckoutFailure from './Pages/Payment/CheckoutFailure.jsx'
import CheckoutPage from './Pages/Payment/Checkout.jsx'
import CheckoutSuccess from './Pages/Payment/CheckoutSuccess.jsx'
import Contact from './Pages/Contact.jsx'
import CourseDescription from './Pages/Course/CourseDescription.jsx'
import CourseList from './Pages/Course/CourseList.jsx'
import CreateCourse from './Pages/Course/CreateCourse.jsx'
import ImportedLectures from './Pages/Course/ImportedLectures.jsx'
import LiveClasses from './Pages/Course/LiveClasses.jsx'
import Notes from './Pages/Course/Notes.jsx'
import Denied from './Pages/Denied.jsx'
import DisplayLectures from './Pages/Dashboard/DisplayLectures.jsx'
import EditCourse from './Pages/Course/EditCourse.jsx'
import EditProfile from './Pages/User/EditProfile.jsx'
import ForgetPassword from './Pages/Password/ForgetPassword.jsx'
import TestPage from './Pages/Course/TestPage.jsx'
import HomePage from './Pages/HomePage.jsx'
import Login from './Pages/Login.jsx'
import NotFound from './Pages/NotFound.jsx'
import Profile from './Pages/User/Profile.jsx'
import ResetPassword from './Pages/Password/ResetPassword.jsx'
import Signup from './Pages/Signup.jsx'


function App() {
  return (
    <>
      <Routes>
          <Route path='/' element={<HomePage/>}></Route>
          <Route path='/about' element={<AboutUs/>}></Route>
          <Route path='/courses' element={<CourseList/>}></Route>
          <Route path='/assinment&notes' element={<Notes/>}></Route>
          <Route path='/live-classes' element={<LiveClasses/>}></Route>
          <Route path='/course/:courseSlug' element={<Notes/>}></Route>
          <Route path='/imported-lectures' element={<ImportedLectures/>}></Route>
          <Route path='/contact' element={<Contact/>}></Route>
          <Route path='/denied' element={<Denied/>}></Route>
          <Route path='/course/description' element={<CourseDescription/>}></Route>
          <Route path='/course/test' element={<TestPage/>}></Route>

          <Route path='/signup' element={<Signup/>}></Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/forget-password' element={<ForgetPassword/>}></Route>
          <Route path="/reset-password/:resetToken" element={<ResetPassword/>} />
          
          <Route element={<RequireAuth allowedRoles={["ADMIN"]}/>}>
           <Route path='/course/create' element={<CreateCourse/>}></Route>
           <Route path='/course/edit' element={<EditCourse/>}></Route>
           <Route path='/course/addlecture/:courseId?' element={<AddCourseLectures/>}></Route>
           <Route path='/course/addnote/:courseId?' element={<AddNotes/>}></Route>
           <Route path='/admin/dashboard' element={<AdminDeshboard/>}></Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={["ADMIN", 'USER']}/>}>
            <Route path='/user/profile' element={<Profile/>}></Route> 
            <Route path='/user/editprofile' element={<EditProfile/>}></Route> 
            <Route path='/change-password' element={<ChangePassword/>}></Route>
            <Route path='/checkout' element={<CheckoutPage/>}></Route>
            <Route path='/checkout/success' element={<CheckoutSuccess/>}></Route>
            <Route path='/checkout/fail' element={<CheckoutFailure/>}></Route>      
            <Route path='/course/displaylecture' element={<DisplayLectures/>}></Route>
            <Route path='/course/edit' element={<EditCourse/>}></Route>
          </Route>
                  
          <Route path='*' element={<NotFound/>}></Route>
      </Routes>
    </>
  )
}

export default App