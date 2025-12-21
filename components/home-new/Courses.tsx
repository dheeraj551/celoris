"use client";
import React, { useEffect, useState } from 'react';
import { PlayCircle, Clock, Star } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-client';
import { CourseCardProps } from './types';

export const CourseCard: React.FC<CourseCardProps> = ({ id, title, category, instructor, duration, price, tag, image }) => (
    <div className="flex flex-col sm:flex-row bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
        <div className="w-full sm:w-48 bg-slate-200 relative h-48 sm:h-auto">
            <img
                src={image || `https://picsum.photos/200/200?random=${Math.random()}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                alt={title}
            />
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
                <h3 className="text-base font-bold text-slate-900 leading-tight mb-2 line-clamp-2">{title}</h3>
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">This comprehensive course is designed to transform you...</p>

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <div className="flex items-center gap-1"><PlayCircle size={12} /> {instructor || 'Instructor'}</div>
                    <div className="flex items-center gap-1"><Clock size={12} /> {duration || 'N/A'}</div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <span className="text-lg font-bold text-slate-900">₹{price}</span>
                {id ? (
                    <Link
                        href={
                            id === 'class-11-physics-static'
                                ? '/courses/cbse-class-11-physics-comprehensive-course'
                                : id === 'class-12-physics-static'
                                    ? '/courses/cbse-class-12-physics-complete-course'
                                    : id === 'class-10-physics-static'
                                        ? '/courses/cbse-class-10-physics-light-electricity-magnetism-energy'
                                        : id === 'class-9-chemistry-static'
                                            ? '/courses/cbse-class-9-chemistry-complete-course'
                                            : id === 'b65a0bc8-2e86-4170-9a3c-91c4050de31f'
                                                ? '/courses/cbse-class-9-physics-motion-force-energy-sound'
                                                : id === 'class-10-chemistry-static'
                                                    ? '/courses/cbse-class-10-chemistry-complete-course'
                                                    : id === 'yoga-mastery-2025-static'
                                                        ? '/courses/complete-2025-yoga-mastery-course'
                                                        : `/learn/course/${id}`
                        }
                        className="px-4 py-1.5 bg-brand-600 text-white text-xs font-semibold rounded-lg hover:bg-brand-700 transition-colors shadow-sm shadow-brand-200 inline-block text-center"
                    >
                        View Course
                    </Link>
                ) : (
                    <button className="px-4 py-1.5 bg-brand-600 text-white text-xs font-semibold rounded-lg hover:bg-brand-700 transition-colors shadow-sm shadow-brand-200">
                        View Course
                    </button>
                )}
            </div>
        </div>
    </div>
);

interface CoursesProps {
    title?: string;
    description?: string;
    limit?: number;
    showBrowseAll?: boolean;
    featured?: boolean;
}

export const Courses: React.FC<CoursesProps> = ({
    title = "Latest Courses",
    description = "Explore our newest courses and start your learning journey.",
    limit = 6,
    showBrowseAll = true,
    featured = false
}) => {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Static featured courses
    const staticCourses = [
        {
            id: 'class-10-chemistry-static',
            title: 'Class 10 Chemistry Full Course',
            subject: 'Chemistry',
            instructor_name: 'Celoris Designs llp',
            course_duration: 'Full Year',
            price: 1999,
            is_featured: true,
            course_image_url: '/class-10-chemistry-cover.jpg',
            is_static: true,
            static_url: '/courses/cbse-class-10-chemistry-complete-course'
        },
        {
            id: 'class-9-chemistry-static',
            title: 'Class 9 Chemistry: Complete Course Overview',
            subject: 'Chemistry',
            instructor_name: 'Celoris Designs',
            course_duration: 'Full Year',
            price: 1999,
            is_featured: true,
            course_image_url: '/class-9-chemistry-cover.jpg',
            is_static: true,
            static_url: '/courses/cbse-class-9-chemistry-complete-course'
        },
        {
            id: 'class-12-physics-static',
            title: 'Class 12th Physics Complete Course',
            subject: 'Physics',
            instructor_name: 'Celoris Designs',
            course_duration: 'Full Year',
            price: 2499,
            is_featured: true,
            course_image_url: '/class-12-physics-cover.jpg',
            is_static: true,
            static_url: '/courses/cbse-class-12-physics-complete-course'
        },
        {
            id: 'class-11-physics-static',
            title: 'Class 11 Physics: Comprehensive Course Syllabus (2025-26)',
            subject: 'Physics',
            instructor_name: 'Celoris Designs',
            course_duration: 'Full Year',
            price: 2499,
            is_featured: true,
            course_image_url: '/class-11-physics-cover.jpg',
            is_static: true,
            static_url: '/courses/cbse-class-11-physics-comprehensive-course'
        },
        {
            id: 'class-10-physics-static',
            title: 'Class 10 Physics Master Course: Light, Electricity, Magnetism & Energy',
            subject: 'Physics',
            instructor_name: 'Celoris Academy',
            course_duration: '4 months',
            price: 1500,
            is_featured: true,
            course_image_url: '/class-10-physics-cover.jpg',
            is_static: true,
            static_url: '/courses/cbse-class-10-physics-light-electricity-magnetism-energy'
        },
        {
            id: 'yoga-mastery-2025-static',
            title: 'The Complete 2025 Yoga Mastery Course: From Beginner Poses to Advanced Mindfulness',
            subject: 'Yoga',
            instructor_name: 'Celoris Designs llp',
            course_duration: '12 Weeks',
            price: 6000,
            is_featured: true,
            course_image_url: '/yoga-mastery-2025-cover.jpg',
            is_static: true,
            static_url: '/courses/complete-2025-yoga-mastery-course'
        }
    ];

    useEffect(() => {
        const fetchCourses = async () => {
            const supabase = createClient();
            let query = supabase
                .from('courses')
                .select('*')
                .eq('is_published', true);

            if (featured) {
                query = query.eq('is_featured', true);
            }

            const { data, error } = await query
                .order('created_at', { ascending: false })
                .limit(limit);

            if (data) {
                // Exclude test courses
                const testCourseTitles = [
                    'Agentic AI for Beginners: From Prompts to Action',
                    'Mastering Nano Banana Pro',
                    'My new ai course will be here'
                ];
                const filteredDbCourses = data.filter(c => !testCourseTitles.includes(c.title));

                // Combine static + dynamic
                const combined = [...staticCourses, ...filteredDbCourses].slice(0, limit);
                setCourses(combined);
            } else {
                setCourses(staticCourses);
            }
            setLoading(false);
        };

        fetchCourses();
    }, [limit, featured]);

    return (
        <div className="mt-16 mb-16">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                {description && <p className="text-slate-500 text-sm mt-1">{description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            id={course.id}
                            title={course.title}
                            category={course.subject}
                            instructor={course.instructor_name}
                            duration={course.course_duration}
                            price={course.price}
                            tag={course.is_featured ? 'Featured' : undefined}
                            image={course.course_image_url}
                        />
                    ))
                ) : (
                    !loading && <div className="text-center col-span-2 text-slate-500">No courses available at the moment.</div>
                )}
            </div>

            {showBrowseAll && (
                <div className="mt-8 text-center">
                    <Link href="/learn/courses" className="px-6 py-2 bg-brand-600 text-white text-sm font-medium rounded-full hover:bg-brand-700 transition-colors inline-block shadow-sm shadow-brand-200">
                        Browse All Courses
                    </Link>
                </div>
            )}
        </div>
    );
};
