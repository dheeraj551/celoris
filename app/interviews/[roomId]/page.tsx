import { Metadata } from 'next';
import { InterviewStudio } from '@/components/interview/InterviewStudio';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ roomId: string }>;
}): Promise<Metadata> {
  const { roomId } = await params;
  return {
    title: `Interview Room #${roomId} | Celoris VantageHire`,
    description: `Confidential Technical Video Interview Session #${roomId} with Celoris Designs LLP. End-to-end encrypted video, synchronized code sandbox, and collaborative evaluation.`,
    openGraph: {
      title: `Interview Room #${roomId} | Celoris VantageHire`,
      description: `Join your confidential technical interview session #${roomId} with Celoris. High-definition video, collaborative code sandbox, and encrypted audio.`,
      url: `https://celorisdesigns.com/interviews/${roomId}`,
      siteName: 'Celoris VantageHire',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Interview Room #${roomId} | Celoris VantageHire`,
      description: `Join your confidential technical interview session #${roomId} with Celoris.`,
    }
  };
}

export default async function InterviewRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  return <InterviewStudio initialRoomId={roomId} defaultView="video" />;
}
