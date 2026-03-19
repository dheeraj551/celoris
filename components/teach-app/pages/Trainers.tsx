import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Filter, Video, Users, ChevronDown } from 'lucide-react';

const TRAINERS = [
  {
    id: '1',
    name: 'Dheeraj K.',
    subject: 'Advanced Excel & Data Analytics',
    rating: 4.9,
    reviews: 342,
    location: 'Gurgaon',
    modes: ['Online', 'Offline'],
    image: 'https://picsum.photos/seed/dheeraj/200/200',
    hourlyRate: 800,
    experience: 13,
    bio: 'Data Analytics expert with 13+ years of corporate experience. I help professionals master Excel, PowerBI, and SQL to accelerate their careers.',
    tags: ['Excel', 'PowerBI', 'SQL', 'Data Science']
  },
  {
    id: '2',
    name: 'Priya S.',
    subject: 'Spoken English & Communication',
    rating: 4.8,
    reviews: 128,
    location: 'South Delhi',
    modes: ['Online', 'Offline'],
    image: 'https://picsum.photos/seed/priya/200/200',
    hourlyRate: 500,
    experience: 6,
    bio: 'Certified English trainer focusing on conversational fluency, interview preparation, and business communication.',
    tags: ['Spoken English', 'IELTS', 'Business English']
  },
  {
    id: '3',
    name: 'Rahul M.',
    subject: 'Full Stack Web Development',
    rating: 5.0,
    reviews: 89,
    location: 'Noida',
    modes: ['Online', 'Offline'],
    image: 'https://picsum.photos/seed/rahul/200/200',
    hourlyRate: 1200,
    experience: 8,
    bio: 'Senior Software Engineer teaching React, Node.js, and Next.js. I focus on project-based learning to get you job-ready.',
    tags: ['React', 'Next.js', 'Node.js', 'TypeScript']
  },
  {
    id: '4',
    name: 'Anjali D.',
    subject: 'Classical Dance (Kathak)',
    rating: 4.7,
    reviews: 215,
    location: 'Faridabad',
    modes: ['Offline'],
    image: 'https://picsum.photos/seed/anjali/200/200',
    hourlyRate: 600,
    experience: 10,
    bio: 'Professional Kathak dancer and choreographer. Offering structured classes for beginners to advanced levels.',
    tags: ['Kathak', 'Classical Dance', 'Choreography']
  },
  {
    id: '5',
    name: 'Vikram Singh',
    subject: 'Mathematics & Physics (JEE/NEET)',
    rating: 4.9,
    reviews: 450,
    location: 'Ghaziabad',
    modes: ['Online'],
    image: 'https://picsum.photos/seed/vikram/200/200',
    hourlyRate: 1000,
    experience: 15,
    bio: 'Ex-faculty with a track record of producing top ranks in JEE and NEET. Concept-driven teaching methodology.',
    tags: ['Mathematics', 'Physics', 'JEE', 'NEET']
  }
];

export function Trainers() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Find the perfect trainer</h1>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search subject or skill (e.g., Excel, English)" 
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="md:w-72 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Location" 
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <button className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-gray-900 mb-4 pb-4 border-b border-gray-100">
              <Filter className="h-5 w-5" /> Filters
            </div>
            
            <div className="space-y-6">
              {/* Mode */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Class Mode</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500" defaultChecked />
                    <span className="text-sm text-gray-700">Online</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500" />
                    <span className="text-sm text-gray-700">Offline (In-person)</span>
                  </label>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Hourly Rate</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="price" className="text-emerald-600 focus:ring-emerald-500" />
                    <span className="text-sm text-gray-700">Under ₹500</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="price" className="text-emerald-600 focus:ring-emerald-500" />
                    <span className="text-sm text-gray-700">₹500 - ₹1000</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="price" className="text-emerald-600 focus:ring-emerald-500" />
                    <span className="text-sm text-gray-700">Above ₹1000</span>
                  </label>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Rating</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="rating" className="text-emerald-600 focus:ring-emerald-500" defaultChecked />
                    <span className="text-sm text-gray-700 flex items-center">4.5 & up <Star className="h-3 w-3 ml-1 text-amber-500 fill-amber-500" /></span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="rating" className="text-emerald-600 focus:ring-emerald-500" />
                    <span className="text-sm text-gray-700 flex items-center">4.0 & up <Star className="h-3 w-3 ml-1 text-amber-500 fill-amber-500" /></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-gray-700 font-medium">{TRAINERS.length} trainers found</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              Sort by: 
              <button className="flex items-center gap-1 font-medium text-gray-900 hover:text-emerald-600">
                Relevance <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {TRAINERS.map((trainer) => (
              <div key={trainer.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col sm:flex-row gap-6">
                <div className="sm:w-48 flex-shrink-0">
                  <img 
                    src={trainer.image} 
                    alt={trainer.name} 
                    className="w-full aspect-square object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link to={`/trainers/${trainer.id}`} className="text-xl font-bold text-gray-900 hover:text-emerald-600 transition-colors">
                        {trainer.name}
                      </Link>
                      <p className="text-emerald-600 font-medium">{trainer.subject}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">₹{trainer.hourlyRate}</div>
                      <div className="text-sm text-gray-500">per hour</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1 font-medium text-gray-900 bg-amber-50 px-2 py-1 rounded-md">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      {trainer.rating} ({trainer.reviews})
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> {trainer.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" /> {trainer.experience} yrs exp
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {trainer.bio}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {trainer.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex gap-3">
                    <Link to={`/trainers/${trainer.id}`} className="flex-1 bg-white border border-emerald-600 text-emerald-600 text-center py-2.5 rounded-xl font-medium hover:bg-emerald-50 transition-colors">
                      View Profile
                    </Link>
                    <button className="flex-1 bg-emerald-600 text-white text-center py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-colors">
                      Book Demo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-10 flex justify-center">
            <nav className="flex items-center gap-2">
              <button className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
              <button className="w-10 h-10 rounded-lg bg-emerald-600 text-white font-medium">1</button>
              <button className="w-10 h-10 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium">2</button>
              <button className="w-10 h-10 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium">3</button>
              <span className="text-gray-500">...</span>
              <button className="p-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">Next</button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
