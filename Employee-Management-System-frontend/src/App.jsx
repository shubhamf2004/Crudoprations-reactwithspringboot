import PostUser from './Pages/Employee/PostUser.jsx'
import NoMatch from './Pages/NoMatch.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import React from 'react';
import Home from './Pages/Home.jsx';
import { Routes, Route, Navigate } from 'react-router-dom';
import UpdateUser from './Pages/Employee/UpdateUser.jsx';
import PersonnelProfile from './Pages/Employee/PersonnelProfile.jsx';
import Layout from './Components/Layout.jsx';
import { AuthProvider } from './Context/AuthContext';
import PrivateRoute from './Components/PrivateRoute.jsx';
import Login from './Pages/Auth/Login.jsx';
import Signup from './Pages/Auth/Signup.jsx';
import Departments from './Pages/Departments.jsx';
import MainDashboard from './Pages/MainDashboard.jsx';
import Attendance from './Pages/Attendance.jsx';
import Leaves from './Pages/Leaves.jsx';
import DepartmentDetail from './Pages/DepartmentDetail.jsx';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route path="/view" element={
            <PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_HR', 'ROLE_USER']}>
              <MainDashboard />
            </PrivateRoute>
          } />
          <Route path="/view/employees" element={
            <PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_HR']}>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/attendance" element={
            <PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_HR', 'ROLE_USER']}>
              <Attendance />
            </PrivateRoute>
          } />
          <Route path="/leaves" element={
            <PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_HR', 'ROLE_USER']}>
              <Leaves />
            </PrivateRoute>
          } />

          <Route path="/departments" element={
            <PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_HR']}>
              <Departments />
            </PrivateRoute>
          } />
          <Route path="/employee" element={
            <PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_HR']}>
              <PostUser />
            </PrivateRoute>
          } />
          <Route path="/employee/:id" element={
            <PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_HR']}>
              <UpdateUser />
            </PrivateRoute>
          } />
          <Route path="/employee/details/:id" element={
            <PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_HR', 'ROLE_USER']}>
              <PersonnelProfile />
            </PrivateRoute>
          } />

          <Route path="/departments/:name" element={
            <PrivateRoute allowedRoles={['ROLE_ADMIN', 'ROLE_HR', 'ROLE_USER']}>
              <DepartmentDetail />
            </PrivateRoute>
          } />

          <Route path="*" element={<NoMatch />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

export default App
