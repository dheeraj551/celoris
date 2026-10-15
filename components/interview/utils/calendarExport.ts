import { InterviewSession } from '../types';

export function generateIcsCalendarFile(session: InterviewSession): void {
  // Parse date and time
  const [hours, minutes] = (session.startTime || '14:00').split(':').map(Number);
  const startDate = new Date(session.scheduledDate);
  startDate.setHours(hours, minutes, 0, 0);

  const endDate = new Date(startDate.getTime() + (session.durationMinutes || 45) * 60 * 1000);

  const formatDateToICS = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const startStr = formatDateToICS(startDate);
  const endStr = formatDateToICS(endDate);
  const nowStr = formatDateToICS(new Date());

  const summary = `Celoris Interview: ${session.candidateName} - ${session.role} (${session.roundType})`;
  const description = `Celoris VantageHire Technical Interview\\nCandidate: ${session.candidateName}\\nRole: ${session.role} (${session.targetLevel})\\nRound: ${session.roundType}\\nRoom ID: ${session.meetingRoomId}\\nPasscode: ${session.passcode}\\n\\nPlease join 5 minutes early to test camera, microphone, and calibrate scorecards.`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Celoris Designs LLP//VantageHire Interview Suite//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${session.id}-${Date.now()}@celoris.in`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:Celoris LiveKit Interview Room #${session.meetingRoomId}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `celoris-interview-${session.candidateName.toLowerCase().replace(/\s+/g, '-')}-${session.scheduledDate}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
