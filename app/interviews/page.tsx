import { Metadata } from 'next';
import { InterviewStudio } from '@/components/interview/InterviewStudio';

export const metadata: Metadata = {
  title: 'Celoris VantageHire — Enterprise Video Interview & Candidate ATS Platform',
  description: 'High-definition 1080p encrypted technical video interviews, synchronized code workspace, automated rubric scoring, and hiring committee pipeline tracking.',
  openGraph: {
    title: 'Celoris VantageHire — Enterprise Video Interview Suite',
    description: 'High-definition 1080p encrypted technical video interviews, synchronized code workspace, automated rubric scoring, and hiring committee pipeline tracking.',
    url: 'https://celorisdesigns.com/interviews',
    siteName: 'Celoris VantageHire',
    type: 'website',
  }
};

export default function InterviewsPage() {
  return <InterviewStudio defaultView="landing" />;
}
