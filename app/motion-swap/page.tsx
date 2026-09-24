import { Metadata } from 'next';
import { MotionSwapStudio } from '@/components/genjutsu/GenjutsuStudio';

export const metadata: Metadata = {
  title: 'Motion Swap Studio — AI Motion Transfer & Object Swap | Celoris',
  description:
    'Turn one video into many with Motion Swap Studio. Extract motion, choreography, and camera movement to recast with your characters, or surgically swap objects and clothes while keeping scenes untouched.',
  openGraph: {
    title: 'Motion Swap Studio — AI Motion Transfer & Object Swap',
    description: 'Reality manipulation & video recasting powered by Higgsfield Genjutsu models.',
    images: ['/images/genjutsu/hero-showcase.png'],
  },
};

export default function MotionSwapPage() {
  return (
    <main className="w-full h-screen bg-[#0a0b0e] overflow-hidden">
      <MotionSwapStudio />
    </main>
  );
}
