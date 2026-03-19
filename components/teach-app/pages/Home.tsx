import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, Users, Video, CheckCircle2, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

export function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-emerald-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/teaching/1920/1080')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Scale your teaching business in Delhi/NCR & Online.
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 mb-10 max-w-2xl">
              Stop paying for expensive leads. Celoris gives you the tools to host courses, manage students, and build your personal brand—all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Link to="/dashboard/trainer/overview" className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-500 transition-all flex items-center justify-center whitespace-nowrap text-lg shadow-lg">
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-colors flex items-center justify-center whitespace-nowrap text-lg shadow-lg">
                    Start Teaching for Free
                  </Link>
                  <Link to="/login" className="bg-emerald-800/50 text-white border border-emerald-400/30 px-8 py-4 rounded-xl font-medium hover:bg-emerald-800 transition-colors flex items-center justify-center whitespace-nowrap text-lg backdrop-blur-sm">
                    login
                  </Link>
                </>
              )}
            </div>
            
            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-emerald-200">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-400" /> 0% commission on first 5 students</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-400" /> No per-lead charges</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-400" /> Delhi/NCR Focused</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Prop Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to teach online</h2>
            <p className="text-lg text-gray-600">We replace your fragmented tools with a single, powerful platform designed specifically for independent trainers and institutes.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Your Branded Microsite</h3>
              <p className="text-gray-600">Get a professional, SEO-optimized profile page (e.g., yourname.celoris.in) to showcase your expertise, reviews, and courses.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Video className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Integrated LMS</h3>
              <p className="text-gray-600">Host your pre-recorded video courses, create quizzes, and issue certificates directly on the platform.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart CRM & Enquiries</h3>
              <p className="text-gray-600">Manage all your student leads in one place. Track follow-ups, schedule demo classes, and convert more students.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Stop paying for fake leads.</h2>
              <p className="text-lg text-gray-600 mb-8">
                Traditional platforms charge you "coins" just to contact a student, eating into your profits. Celoris uses a transparent subscription and revenue-share model so you only pay when you actually earn.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 block">Verified Delhi/NCR Students</strong>
                    <span className="text-gray-600">Connect with local students for offline classes or teach anyone online.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 block">Secure Payments & Invoicing</strong>
                    <span className="text-gray-600">Automated fee collection via UPI/Cards with GST-compliant invoicing.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 block">Complete Ownership</strong>
                    <span className="text-gray-600">You own your audience. Chat directly with students without platform restrictions.</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex-1 w-full max-w-md bg-gray-50 p-8 rounded-3xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">The Celoris Advantage</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100">
                  <span className="text-gray-600">Per-Lead Cost</span>
                  <span className="font-bold text-emerald-600">₹0</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100">
                  <span className="text-gray-600">Course Hosting</span>
                  <span className="font-bold text-emerald-600">Included</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100">
                  <span className="text-gray-600">Custom Branding</span>
                  <span className="font-bold text-emerald-600">Yes</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100">
                  <span className="text-gray-600">Direct Chat</span>
                  <span className="font-bold text-emerald-600">Unlimited</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to grow your teaching income?</h2>
          <p className="text-emerald-100 text-lg mb-10">
            Join hundreds of expert trainers in Delhi/NCR who are already building their brand and managing their students on Celoris.
          </p>
          {user ? (
            <Link to="/dashboard/trainer/overview" className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-colors inline-flex items-center gap-2 text-lg">
              Access Your Dashboard <ArrowRight className="h-5 w-5" />
            </Link>
          ) : (
            <Link to="/register" className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-colors inline-flex items-center gap-2 text-lg">
              Create Your Trainer Profile <ArrowRight className="h-5 w-5" />
            </Link>
          )}
          <p className="mt-6 text-emerald-200 text-sm">Takes less than 2 minutes to set up. No credit card required.</p>
        </div>
      </section>
    </div>
  );
}
