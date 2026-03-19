import { useState } from 'react';
import { ArrowLeft, Upload, Plus, Trash2, Video, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CreateCourse() {
  const [activeTab, setActiveTab] = useState('basic');
  const [modules, setModules] = useState([
    { id: 1, title: 'Introduction', lessons: [{ id: 1, title: 'Welcome to the course', type: 'video' }] }
  ]);

  const addModule = () => {
    setModules([...modules, { id: Date.now(), title: 'New Module', lessons: [] }]);
  };

  const addLesson = (moduleId: number) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return { ...m, lessons: [...m.lessons, { id: Date.now(), title: 'New Lesson', type: 'video' }] };
      }
      return m;
    }));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/dashboard/trainer/courses" className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-gray-500 mt-1">Fill in the details to publish your course</p>
        </div>
        <div className="ml-auto flex gap-3">
          <button className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
            Save Draft
          </button>
          <button className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors">
            Publish Course
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button 
            className={`flex-1 py-4 px-6 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'basic' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Information
          </button>
          <button 
            className={`flex-1 py-4 px-6 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'curriculum' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('curriculum')}
          >
            Curriculum
          </button>
          <button 
            className={`flex-1 py-4 px-6 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'pricing' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            onClick={() => setActiveTab('pricing')}
          >
            Pricing & Settings
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'basic' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                <input type="text" placeholder="e.g. Complete Python Bootcamp" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Description</label>
                <textarea rows={5} placeholder="Describe what students will learn..." className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                    <option>Programming</option>
                    <option>Design</option>
                    <option>Marketing</option>
                    <option>Business</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Hinglish</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Thumbnail</label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">Build your course curriculum by adding modules and lessons.</p>
                <button onClick={addModule} className="flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg transition-colors">
                  <Plus className="h-4 w-4" /> Add Module
                </button>
              </div>

              <div className="space-y-6">
                {modules.map((module, index) => (
                  <div key={module.id} className="border border-gray-200 rounded-2xl overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="font-bold text-gray-500">Module {index + 1}:</span>
                        <input 
                          type="text" 
                          value={module.title}
                          onChange={(e) => {
                            const newModules = [...modules];
                            newModules[index].title = e.target.value;
                            setModules(newModules);
                          }}
                          className="bg-transparent border-none focus:ring-0 font-bold text-gray-900 p-0 flex-1"
                        />
                      </div>
                      <button className="text-gray-400 hover:text-red-600 transition-colors p-2">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      {module.lessons.map((lesson, lIndex) => (
                        <div key={lesson.id} className="flex items-center gap-3 bg-white border border-gray-200 p-3 rounded-xl shadow-sm group">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            {lesson.type === 'video' ? <Video className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                          </div>
                          <span className="text-sm font-medium text-gray-500">Lesson {lIndex + 1}:</span>
                          <input 
                            type="text" 
                            value={lesson.title}
                            onChange={(e) => {
                              const newModules = [...modules];
                              newModules[index].lessons[lIndex].title = e.target.value;
                              setModules(newModules);
                            }}
                            className="bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-900 p-0 flex-1"
                          />
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg">
                              Add Content
                            </button>
                            <button className="text-gray-400 hover:text-red-600 p-1.5">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <button 
                        onClick={() => addLesson(module.id)}
                        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="h-4 w-4" /> Add Lesson
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-8 max-w-3xl">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Course Pricing</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                      <input type="number" placeholder="2999" className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discounted Price (Optional)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                      <input type="number" placeholder="1999" className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Course Settings</h3>
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center h-5 mt-0.5">
                      <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" defaultChecked />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Issue Certificate</p>
                      <p className="text-sm text-gray-500">Automatically issue a certificate of completion when students finish all lessons.</p>
                    </div>
                  </label>
                  
                  <label className="flex items-start gap-3 cursor-pointer p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center h-5 mt-0.5">
                      <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" defaultChecked />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Q&A Section</p>
                      <p className="text-sm text-gray-500">Allow students to ask questions and discuss topics within lessons.</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
