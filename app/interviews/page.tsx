import { Metadata } from 'next';
import { InterviewStudio } from '@/components/interview/InterviewStudio';

export const metadata: Metadata = {
  title: 'Celoris VantageHire — Enterprise LiveKit Video Interview & ATS Platform',
  description: 'High-definition 1080p WebRTC technical interviews, synchronized code workspace, automated rubric scoring, and candidate pipeline tracking built on LiveKit.',
  openGraph: {
    title: 'Celoris VantageHire — Enterprise LiveKit Video Interview Suite',
    description: 'High-definition 1080p WebRTC technical interviews, synchronized code workspace, automated rubric scoring, and candidate pipeline tracking.',
  }
};

export default function InterviewsPage() {
  return <InterviewStudio defaultView="landing" />;
}
