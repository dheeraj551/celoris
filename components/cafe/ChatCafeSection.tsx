import React from 'react';
import { Coffee, Users, Sparkles, ArrowRight } from 'lucide-react';

// Entry point for "Celoris Chat Café" — a real-time multiplayer retro
// Yahoo-Chat-era chat lounge (separate from the regular Café rooms):
// table-hopping, custom avatars & chat bubbles, drink gifts, guided
// discussions, a moderation console, and a permanent Wall of Fame
// guestbook. Deliberately styled with a distinct retro purple/magenta
// palette against the rest of the Café's emerald theme, so it reads as its
// own "room" the moment you scroll to it — same card/badge/blur language as
// the rest of the page, different accent.

const SAMPLE_MESSAGES = [
  { name: 'Captain_Byte99', color: 'text-cyan-400', text: 'anyone else stuck debugging since 2am lol' },
  { name: 'MysticMira', color: 'text-fuchsia-400', text: 'pulled up a chair at the Idea Roastery, come chat' },
  { name: 'RonnieFromAccounts', color: 'text-amber-400', text: 'guys I just want to talk about cricket' },
];

interface ChatCafeSectionProps {
  onEnter?: () => void;
}

export default function ChatCafeSection({ onEnter }: ChatCafeSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-fuchsia-500/20 bg-gradient-to-b from-[#120a18] to-[#0a0610] p-6 md:p-10">
      {/* Ambient glows in the retro purple/cyan palette */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      {/* Faint retro grid, matching the cyber-grid treatment used elsewhere in Café */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(217,70,239,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
        {/* Copy side */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-950/40 border border-fuchsia-500/30 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-fuchsia-400">
              Now Live
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-display font-black italic tracking-tight text-white mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-purple-300 to-cyan-400">
              CELORIS CHAT CAFÉ
            </span>
          </h2>

          <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-6 max-w-lg">
            A throwback to old-school chatrooms — pull up a chair at one of four retro
            tables, customize your avatar and chat bubble, treat fellow users to a
            drink, host a guided discussion, and sign the permanent Wall of Fame.
            Real people, real time, 1999 Yahoo-Chat energy.
          </p>

          <ul className="space-y-2.5 mb-7">
            {[
              { icon: Users, text: 'Four themed tables with their own vibe & slow mode' },
              { icon: Coffee, text: 'Custom avatars, chat bubbles & drink gifts' },
              { icon: Sparkles, text: 'Retro Yahoo-Chat-era look, feel & arcade cabinet' },
            ].map(({ icon: Icon, text }, i) => (
              <li key={i} className="flex items-center gap-3 text-xs md:text-sm text-gray-300">
                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-fuchsia-400" />
                </span>
                {text}
              </li>
            ))}
          </ul>

          <button
            onClick={onEnter}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-fuchsia-950/40 transition-all hover:scale-[1.02]"
          >
            <span>Enter Chat Café</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Retro chat-room preview mock */}
        <div className="relative">
          <div className="rounded-2xl border border-fuchsia-500/20 bg-[#0d0710]/90 shadow-[0_20px_50px_-20px_rgba(217,70,239,0.25)] overflow-hidden">
            {/* Faux window chrome, Y2K messenger style */}
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-fuchsia-500/10 bg-fuchsia-950/20">
              <span className="w-2 h-2 rounded-full bg-red-500/70" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/70" />
              <span className="w-2 h-2 rounded-full bg-green-500/70" />
              <span className="ml-2 text-[10px] font-mono text-fuchsia-300/70 tracking-wide">
                chat-cafe-main-lounge.log
              </span>
            </div>

            <div className="p-4 space-y-3">
              {SAMPLE_MESSAGES.map((msg, i) => (
                <div key={i} className="text-xs md:text-sm font-mono leading-relaxed">
                  <span className={`font-bold ${msg.color}`}>{msg.name}:</span>{' '}
                  <span className="text-gray-300">{msg.text}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-xs font-mono text-gray-500">is typing</span>
                <span className="flex gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-gray-500 animate-pulse [animation-delay:0ms]"></span>
                  <span className="w-1 h-1 rounded-full bg-gray-500 animate-pulse [animation-delay:150ms]"></span>
                  <span className="w-1 h-1 rounded-full bg-gray-500 animate-pulse [animation-delay:300ms]"></span>
                </span>
              </div>
            </div>
          </div>

          <span className="absolute -bottom-3 -right-3 text-[10px] font-mono text-fuchsia-500/40 tracking-wider select-none">
            click to pull up a chair
          </span>
        </div>
      </div>
    </div>
  );
}
