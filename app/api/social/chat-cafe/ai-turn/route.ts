import { NextResponse } from 'next/server';

// Deprecated: Chat Café's AI characters no longer speak on their own.
// Autopilot (Z.ai-generated dialogue, timed turns, memory compression) was
// removed in favor of moderators/admins simply typing a character's lines
// themselves — see the messages route's `asCharacterId` puppeting option
// and the admin dashboard's "Send as Character" control. Nothing in the
// app calls this route anymore; it's kept only as a harmless no-op in case
// an old cached client bundle still has it wired up during a deploy.
export async function POST() {
  return NextResponse.json({ skipped: true, reason: 'autopilot_removed' });
}
