import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import { MOCK_ASSIGNMENTS } from '../constants';
import { generateLessonPlan } from '../services/geminiService';

const CourseManager: React.FC = () => {
  const [showPlanner, setShowPlanner] = useState(false);
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('60 minutes');
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsLoading(true);
    const result = await generateLessonPlan(topic, duration);
    setGeneratedPlan(result);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Course Manager</h1>
          <p className="text-slate-500 mt-1">Manage curriculum and sync with Google Classroom.</p>
        </div>
        <div className="flex gap-3">
          <button 
             className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
             onClick={() => alert('Simulated Google Classroom Sync: 3 Assignments Updated.')}
          >
            <Icons.Sync size={18} className="text-green-600" />
            Sync Classroom
          </button>
          <button 
            onClick={() => setShowPlanner(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Icons.AI size={18} />
            AI Lesson Planner
          </button>
        </div>
      </div>

      {showPlanner && (
        <div className="bg-white rounded-xl border border-indigo-100 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-4">
          <div className="bg-gradient-to-r from-indigo-50 to-white p-6 border-b border-indigo-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-indigo-900 flex items-center gap-2">
                  <Icons.AI className="text-indigo-600" /> Gemini Lesson Planner
                </h3>
                <p className="text-indigo-600/80 text-sm mt-1">Generate comprehensive lesson plans instantly.</p>
              </div>
              <button onClick={() => setShowPlanner(false)} className="text-slate-400 hover:text-slate-600">
                <span className="text-2xl">×</span>
              </button>
            </div>
            
            <div className="mt-4 flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-600 mb-1">Lesson Topic</label>
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Introduction to Thermodynamics" 
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                />
              </div>
              <div className="w-40">
                <label className="block text-xs font-medium text-slate-600 mb-1">Duration</label>
                <select 
                  value={duration} 
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                >
                  <option>30 minutes</option>
                  <option>45 minutes</option>
                  <option>60 minutes</option>
                  <option>90 minutes</option>
                </select>
              </div>
              <button 
                onClick={handleGenerate}
                disabled={isLoading || !topic}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors min-w-[120px]"
              >
                {isLoading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
          
          {generatedPlan && (
            <div className="p-6 bg-slate-50 max-h-96 overflow-y-auto prose prose-indigo prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-slate-700">{generatedPlan}</pre>
            </div>
          )}
        </div>
      )}

      {/* Assignments List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-4 bg-slate-50 border-b border-slate-200 font-medium text-slate-700">Active Assignments</div>
         <table className="w-full text-left text-sm">
            <thead className="text-slate-500 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium">Assignment Title</th>
                <th className="px-6 py-3 font-medium">Platform</th>
                <th className="px-6 py-3 font-medium">Due Date</th>
                <th className="px-6 py-3 font-medium">Submission Status</th>
                <th className="px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_ASSIGNMENTS.map(a => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{a.title}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      a.platform === 'GoogleClassroom' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {a.platform === 'GoogleClassroom' ? 'Google Classroom' : 'EduStream'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{a.dueDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full" 
                          style={{ width: `${(a.submitted / a.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-500">{a.submitted}/{a.total}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-indigo-600 hover:text-indigo-800 font-medium">Grade</button>
                  </td>
                </tr>
              ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default CourseManager;