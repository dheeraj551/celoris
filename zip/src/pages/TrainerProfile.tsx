import { useParams } from 'react-router-dom';
import { Star, MapPin, Video, Users, CheckCircle2, MessageSquare, Calendar, PlayCircle, Award } from 'lucide-react';

export function TrainerProfile() {
  const { id } = useParams();

  // Mock data for Dheeraj K. (Persona from requirements)
  const trainer = {
    id: '1',
    name: 'Dheeraj K.',
    subject: 'Advanced Excel & Data Analytics',
    rating: 4.9,
    reviews: 342,
    location: 'Gurgaon, Haryana',
    modes: ['Online', 'Offline'],
    image: 'https://picsum.photos/seed/dheeraj/400/400',
    hourlyRate: 800,
    experience: 13,
    bio: `Hi, I'm Dheeraj! I have over 13 years of corporate experience working as a Data Analyst and BI Developer for Fortune 500 companies. 

I specialize in teaching Advanced Excel, PowerBI, SQL, and Python for Data Science. My teaching methodology is highly practical and project-based. I don't just teach formulas; I teach you how to solve real-world business problems.

Whether you are a college student looking to start your career in data, or a working professional aiming for a promotion, my customized curriculum will help you achieve your goals.`,
    tags: ['Excel', 'PowerBI', 'SQL', 'Data Science', 'Python', 'Tableau'],
    stats: {
      studentsTaught: '2,500+',
      responseRate: '98%',
      responseTime: '< 1 hour'
    },
    courses: [
      {
        id: 'c1',
        title: 'Master Advanced Excel for Corporate Jobs',
        price: 2499,
        lessons: 42,
        duration: '15 hours',
        thumbnail: 'https://picsum.photos/seed/excel/300/200'
      },
      {
        id: 'c2',
        title: 'PowerBI Zero to Hero: Build Interactive Dashboards',
        price: 3499,
        lessons: 35,
        duration: '12 hours',
        thumbnail: 'https://picsum.photos/seed/powerbi/300/200'
      }
    ]
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200 pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0 relative">
              <img 
                src={trainer.image} 
                alt={trainer.name} 
                className="w-full h-full object-cover rounded-2xl shadow-md"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-3 -right-3 bg-emerald-100 text-emerald-700 p-2 rounded-full border-4 border-white" title="Verified Profile">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{trainer.name}</h1>
                  <p className="text-xl text-indigo-600 font-medium">{trainer.subject}</p>
                </div>
                <div className="flex gap-3">
                  <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> Message
                  </button>
                  <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Book Demo
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-900 px-3 py-1.5 rounded-lg font-medium">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  {trainer.rating} <span className="text-amber-700 font-normal">({trainer.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-400" /> {trainer.location}
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-gray-400" /> {trainer.experience} Years Exp.
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {trainer.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* About Section */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About {trainer.name.split(' ')[0]}</h2>
            <div className="prose max-w-none text-gray-600 whitespace-pre-line">
              {trainer.bio}
            </div>
          </div>

          {/* Hosted Courses */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Courses by {trainer.name.split(' ')[0]}</h2>
              <button className="text-indigo-600 font-medium hover:text-indigo-700">View all</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trainer.courses.map(course => (
                <div key={course.id} className="border border-gray-200 rounded-xl overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="relative aspect-video">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <PlayCircle className="h-12 w-12 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">{course.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1"><Video className="h-4 w-4" /> {course.lessons} lessons</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">₹{course.price}</span>
                      <button className="text-indigo-600 font-medium text-sm hover:underline">View Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews</h2>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                        S{i}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Student Name</h4>
                        <p className="text-xs text-gray-500">2 weeks ago</p>
                      </div>
                    </div>
                    <div className="flex text-amber-500">
                      <Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-3">
                    Dheeraj is an excellent tutor. His real-world examples made learning PowerBI so much easier. Highly recommended for anyone looking to upskill!
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar / Booking Widget */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg sticky top-24">
            <div className="text-center mb-6 pb-6 border-b border-gray-100">
              <div className="text-3xl font-bold text-gray-900 mb-1">₹{trainer.hourlyRate}</div>
              <div className="text-gray-500 text-sm">per hour for 1:1 sessions</div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Response Time</span>
                <span className="font-medium text-gray-900">{trainer.stats.responseTime}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Students Taught</span>
                <span className="font-medium text-gray-900">{trainer.stats.studentsTaught}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Class Modes</span>
                <span className="font-medium text-gray-900">{trainer.modes.join(', ')}</span>
              </div>
            </div>

            <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors mb-3">
              Book a Session
            </button>
            <button className="w-full bg-white border border-indigo-600 text-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
              Send Enquiry
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">
              First 30-min demo session is free!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
