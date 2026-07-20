import React, { useState } from 'react';
import { MOCK_COURSES } from '../data/mockData';
import { Award, Star, Users, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface LearnTabProps {
  onUpgradeClick: () => void;
}

export default function LearnTab({ onUpgradeClick }: LearnTabProps) {
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);

  const handleEnroll = (courseId: string, courseTitle: string) => {
    if (enrolledCourses.includes(courseId)) return;
    setEnrolledCourses(prev => [...prev, courseId]);
    alert(`Successfully registered for the free student cohort: "${courseTitle}". Welcome aboard! Check your lobby notifications.`);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-emerald-950/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Knowledge Hub
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <h2 className="text-xl md:text-2xl font-display font-black italic text-white tracking-wide mt-1 uppercase">
            UPGRADE YOUR SKILLS WITH COHORTS
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Indian colleges teach the syllabus. Celoris Café teaches the actual high-paying skills with verified peer groups.
          </p>
        </div>

        <button 
          onClick={onUpgradeClick}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-[#0a0a0a] font-bold text-xs hover:scale-102 hover:shadow-[0_4px_15px_rgba(16,185,129,0.25)] transition-all flex items-center gap-2"
        >
          <Zap className="w-4 h-4 text-[#0a0a0a] fill-current" />
          <span>Get VIP Priority Booking</span>
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {MOCK_COURSES.map((course) => {
          const isEnrolled = enrolledCourses.includes(course.id);
          return (
            <div 
              key={course.id}
              className="group relative overflow-hidden rounded-2xl bg-[#0f0f0f] border border-emerald-950/30 p-5 hover:border-emerald-500/40 hover:shadow-[0_15px_35px_-15px_rgba(16,185,129,0.15)] transition-all duration-300 flex flex-col md:flex-row gap-5"
            >
              {/* Image banner */}
              <div className="w-full md:w-36 h-36 rounded-xl overflow-hidden shrink-0 relative bg-zinc-950">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <span className="text-[9px] bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold uppercase">
                    {course.tag}
                  </span>
                </div>
              </div>

              {/* Course Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs text-emerald-400 font-semibold">{course.instructor}</span>
                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors mb-2 tracking-wide leading-snug line-clamp-2">
                    {course.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between mt-4 md:mt-0 pt-4 border-t border-emerald-950/15">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-semibold">{course.enrolledCount} students</span>
                  </div>

                  <button
                    onClick={() => handleEnroll(course.id, course.title)}
                    className={`
                      px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer
                      ${isEnrolled 
                        ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0a] hover:scale-102'}
                    `}
                  >
                    {isEnrolled ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Registered</span>
                      </>
                    ) : (
                      <>
                        <span>Join Cohort</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Free Student Mentorship Promo Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/30 to-teal-950/20 border border-emerald-500/20 p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Host a Skill Room</span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-wide">Are you good at something? Teach on Celoris!</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Whether it is guitar tuning, advanced Figma layout hacks, options trading, or Zumba routines — host a table, share your screen, and build a premium peer community today.
          </p>
        </div>
        <button 
          onClick={() => alert("Apply to Host: Trainer application workspace will be initialized! Check your community email in 24 hours.")}
          className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-[#0a0a0a] font-bold text-xs hover:scale-102 hover:shadow-[0_4px_15px_rgba(16,185,129,0.2)] transition-all whitespace-nowrap"
        >
          Apply to Host a Table
        </button>
      </div>
    </div>
  );
}
