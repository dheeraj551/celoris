import React from 'react';
import { PlayCircle, Clock, Star } from 'lucide-react';
import { CourseCardProps } from './types';

const CourseCard: React.FC<CourseCardProps> = ({ title, category, instructor, duration, price, tag }) => (
    <div className="flex flex-col sm:flex-row bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
        <div className="w-full sm:w-48 bg-slate-200 relative">
            <img src={`https://picsum.photos/200/200?random=${Math.random()}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Course" />
            {tag && <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-950 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">{tag}</span>}
        </div>
        <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">{category}</span>
                    <div className="flex items-center gap-0.5 text-yellow-400">
                        <Star size={10} fill="currentColor" />
                        <span className="text-[10px] font-medium text-slate-500">4.9</span>
                    </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-tight mb-2">{title}</h3>
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">This comprehensive course is designed to transform you...</p>

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-1"><PlayCircle size={12} /> {instructor}</div>
                    <div className="flex items-center gap-1"><Clock size={12} /> {duration}</div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <span className="text-lg font-bold text-slate-900">₹{price}</span>
                <button className="px-4 py-1.5 bg-brand-600 text-white text-xs font-semibold rounded-lg hover:bg-brand-700 transition-colors shadow-sm shadow-brand-200">
                    View Course
                </button>
            </div>
        </div>
    </div>
);

export const Courses: React.FC = () => {
    return (
        <div className="mt-16 mb-16">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Latest Courses</h2>
                <p className="text-slate-500 text-sm mt-1">Explore our newest courses and start your learning journey.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CourseCard
                    title="Mastering Nano Banana Pro"
                    category="Computer Science"
                    instructor="Coreste T."
                    duration="12 hours"
                    price="590"
                    tag="Bestseller"
                />
                <CourseCard
                    title="My New AI Course will be table"
                    category="General"
                    instructor="Prof. Smith"
                    duration="8 hours"
                    price="590"
                    tag="New"
                />
            </div>

            <div className="mt-8 text-center">
                <button className="px-6 py-2 bg-slate-800 text-slate-200 text-sm font-medium rounded-full hover:bg-slate-900 hover:text-white transition-colors">
                    Browse All Courses
                </button>
            </div>
        </div>
    );
};
