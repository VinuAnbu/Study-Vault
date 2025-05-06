import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Subjects from './pages/Subjects';
import SubjectDetail from './pages/SubjectDetail';
import CreateResources from './pages/CreateResources';
import Profile from './pages/Profile';
import TeacherDashboard from './pages/TeacherDashboard';
import Navbar from './components/Navbar';
import AllResources from './pages/AllResources';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MyResources from './pages/MyResources';
import CreateSubject from './pages/CreateSubject';
import UserManage from './pages/UserManage';
import StudentProfilePage from './pages/StudentProfilePage ';
import Notification from './components/Notification';
//import { ToastContainer } from "react-toastify";

function App() {
  return (

    <Router>
      <AuthProvider>
      <div className="min-h-screen bg-blue-50">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/subject" element={<Subjects />} />
          <Route path="/subject/:id" element={<SubjectDetail />} />
          <Route path="/create-resources" element={<CreateResources />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/subjects" element={<AllResources />} />
          <Route path="/my-resources" element={< MyResources/>} />
          <Route path="/create-subject" element={< CreateSubject/>} />
          <Route path="/teacher-dashboard" element={<UserManage/>} />
          <Route path="/student/:studentId" element={<StudentProfilePage />} />
          <Route path="/noti" element={<Notification />} />





          <Route path="/recived-request" element={<TeacherDashboard />} />

        </Routes>
      </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
