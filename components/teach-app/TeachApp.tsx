"use client"

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Trainers } from './pages/Trainers';
import { TrainerProfile } from './pages/TrainerProfile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { TrainerDashboard } from './pages/dashboard/TrainerDashboard';
import { TrainerOverview } from './pages/dashboard/TrainerOverview';
import { TrainerProfile as DashboardTrainerProfile } from './pages/dashboard/TrainerProfile';
import { TrainerCourses } from './pages/dashboard/TrainerCourses';
import { TrainerEnquiries } from './pages/dashboard/TrainerEnquiries';
import { TrainerStudents } from './pages/dashboard/TrainerStudents';
import { CreateCourse } from './pages/dashboard/CreateCourse';
import { TrainerCalendar } from './pages/dashboard/TrainerCalendar';
import { TrainerEarnings } from './pages/dashboard/TrainerEarnings';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}

export default function TeachApp() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/teach" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/teach/trainers" element={<PublicLayout><Trainers /></PublicLayout>} />
        <Route path="/teach/trainers/:id" element={<PublicLayout><TrainerProfile /></PublicLayout>} />
        
        {/* Auth Routes */}
        <Route path="/teach/login" element={<Login />} />
        <Route path="/teach/register" element={<Register />} />
        
        {/* Dashboard Routes */}
        <Route path="/teach/dashboard/trainer" element={<TrainerDashboard />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<TrainerOverview />} />
          <Route path="profile" element={<DashboardTrainerProfile />} />

          <Route path="students" element={<TrainerStudents />} />
          <Route path="enquiries" element={<TrainerEnquiries />} />
          <Route path="calendar" element={<TrainerCalendar />} />
          <Route path="earnings" element={<TrainerEarnings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
