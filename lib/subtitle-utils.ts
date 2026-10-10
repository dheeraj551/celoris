/**
 * Subtitle and Caption utilities for Celoris Video Studio
 * Supports Industry-Standard SubRip (.SRT) and WebVTT (.VTT) formats.
 */

import { Clip } from "@/app/video-studio/page";

/**
 * Format seconds to SRT timecode: 00:00:00,000
 */
export function formatSrtTime(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = Math.floor(s % 60);
  const milliseconds = Math.floor((s % 1) * 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
}

/**
 * Format seconds to WebVTT timecode: 00:00:00.000
 */
export function formatVttTime(totalSeconds: number): string {
  return formatSrtTime(totalSeconds).replace(',', '.');
}

/**
 * Parse timecode string (00:01:23,456 or 01:23.456) to total seconds
 */
export function parseTimecodeToSeconds(timeStr: string): number {
  const clean = timeStr.trim().replace(',', '.');
  const parts = clean.split(':');
  
  if (parts.length === 3) {
    const hours = parseFloat(parts[0]) || 0;
    const minutes = parseFloat(parts[1]) || 0;
    const seconds = parseFloat(parts[2]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  } else if (parts.length === 2) {
    const minutes = parseFloat(parts[0]) || 0;
    const seconds = parseFloat(parts[1]) || 0;
    return minutes * 60 + seconds;
  }
  return parseFloat(clean) || 0;
}

/**
 * Convert Timeline text clips to .SRT formatted string
 */
export function generateSrtContent(clips: Clip[]): string {
  const textClips = clips
    .filter(c => c.type === 'text')
    .sort((a, b) => a.start - b.start);

  if (textClips.length === 0) {
    return "1\n00:00:00,000 --> 00:00:05,000\nNo captions found in project\n";
  }

  return textClips
    .map((clip, index) => {
      const startStr = formatSrtTime(clip.start);
      const endStr = formatSrtTime(clip.end);
      const content = clip.content.trim() || 'Subtitle';
      return `${index + 1}\n${startStr} --> ${endStr}\n${content}\n`;
    })
    .join('\n');
}

/**
 * Convert Timeline text clips to WebVTT formatted string
 */
export function generateVttContent(clips: Clip[]): string {
  const srtBody = generateSrtContent(clips)
    .replace(/,/g, '.')
    .replace(/^\d+\n/gm, ''); // WebVTT does not require cue numbers

  return `WEBVTT - Exported from Celoris Video Studio\n\n${srtBody}`;
}

/**
 * Parse an uploaded .srt or .vtt file into caption blocks
 */
export function parseSubtitleFile(content: string): { start: number; end: number; text: string }[] {
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const blocks = normalized.split(/\n\n+/);
  const results: { start: number; end: number; text: string }[] = [];

  for (const block of blocks) {
    const lines = block.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    // Find timecode line containing "-->"
    const timeLineIndex = lines.findIndex(l => l.includes('-->'));
    if (timeLineIndex === -1) continue;

    const timeLine = lines[timeLineIndex];
    const [startPart, endPart] = timeLine.split('-->').map(s => s.trim());
    if (!startPart || !endPart) continue;

    const start = parseTimecodeToSeconds(startPart);
    const end = parseTimecodeToSeconds(endPart);

    // Text lines are everything after the timecode line
    const textLines = lines.slice(timeLineIndex + 1);
    const text = textLines.join(' ').replace(/<[^>]+>/g, '').trim(); // Strip HTML tags

    if (text && end > start) {
      results.push({ start, end, text });
    }
  }

  return results;
}

/**
 * Trigger client-side browser file download
 */
export function triggerSubtitleDownload(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
