import { useState } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TrainerCourses() {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'Advanced Excel Mastery',
      status: 'published',
      students: 45,
      price: 2999,
      thumbnail: 'https://picsum.photos/seed/excel/300/200',
    },
    {
      id: 2,
      title: 'Python for Data Science',
      status: 'draft',
      students: 0,
      price: 4999,
      thumbnail: 'https://picsum.photos/seed/python/300/200',
    },
    {
      id: 3,
      title: 'Digital Marketing Crash Course',
      status: 'published',
      students: 112,
      price: 1499,
      thumbnail: 'https://picsum.photos/seed/marketing/300/200',
    }
  ]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-500 mt-1">Manage your online courses and curriculum</p>
        </div>
        <Link to="/dashboard/trainer/courses/create" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
          <Plus className="h-4 w-4" /> Create Course
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
          <select className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
            <option>Newest First</option>
            <option>Most Students</option>
            <option>Highest Price</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-48">
              <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  course.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{course.title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1"><PlayCircle className="h-4 w-4" /> 12 Lessons</span>
                <span>{course.students} Students</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="font-bold text-gray-900">₹{course.price}</span>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
