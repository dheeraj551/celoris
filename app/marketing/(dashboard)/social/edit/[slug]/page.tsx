"use client"

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Image as ImageIcon, Trash2 } from 'lucide-react';

export default function EditorPage() {
  const params = useParams();
  const slug = params?.slug;
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);

  const insertPlaceholderImage = () => {
    const randomId = Math.floor(Math.random() * 1000);
    setImages(prev => [...prev, `https://picsum.photos/seed/${randomId}/600/400`]);
  };

  return (
    <div className="min-h-screen bg-[#050810] text-white font-sans flex flex-col">
      {/* Editor Action Bar */}
      <div className="border-b border-white/10 p-4 flex items-center justify-between bg-[#0A0F1D]">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/marketing/social/dashboard')}
            className="text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="font-bold">Editing: {slug || 'My Page'}</h2>
        </div>
        <button className="bg-[#10B981] hover:bg-[#059669] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Save size={16} /> Save Changes
        </button>
      </div>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-2xl w-full">
          <h2 className="text-2xl font-bold mb-4">Page Editor</h2>
          <p className="text-white/50 mb-8">
            This is the editing interface for your generated page. Here you can modify text, change images, and update your business details.
          </p>
          
          <div className="mb-6 flex justify-center">
            <button 
              onClick={insertPlaceholderImage}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <ImageIcon size={16} /> Insert Placeholder Image
            </button>
          </div>

          <div className="border border-dashed border-white/20 p-8 rounded-2xl bg-white/5 min-h-[300px] flex flex-col items-center justify-center gap-6">
            {images.length === 0 ? (
              <p className="text-sm text-white/40">Visual block editor coming soon...<br/>Click the button above to test image insertion.</p>
            ) : (
              <div className="w-full flex flex-col gap-6">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/40">
                    <img src={img} alt={`Placeholder preview ${idx}`} className="w-full h-auto object-cover" />
                    <button 
                      onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-4 right-4 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      title="Remove image"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
