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
    description: `Live Technical Video Interview Session #${roomId} on Celoris LiveKit infrastructure.`,
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
