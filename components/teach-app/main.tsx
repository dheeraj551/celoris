import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Trainers } from './pages/Trainers';
import { TrainerProfile } from './pages/TrainerProfile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { TrainerDashboard } from './pages/dashboard/TrainerDashboard';
import { TrainerOverview } from './pages/dashboard/TrainerOverview';
import { TrainerCourses } from './pages/dashboard/TrainerCourses';
import { TrainerEnquiries } from './pages/dashboard/TrainerEnquiries';
import { CreateCourse } from './pages/dashboard/CreateCourse';
import './index.css';

// Layout component for public pages
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/teach-app">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/trainers" element={<PublicLayout><Trainers /></PublicLayout>} />
        <Route path="/trainers/:id" element={<PublicLayout><TrainerProfile /></PublicLayout>} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard/trainer" element={<TrainerDashboard />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<TrainerOverview />} />
          <Route path="courses" element={<TrainerCourses />} />
          <Route path="courses/create" element={<CreateCourse />} />
          <Route path="enquiries" element={<TrainerEnquiries />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
