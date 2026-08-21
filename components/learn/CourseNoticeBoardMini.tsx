"use client"

import React from 'react';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Space+Mono:wght@400;700&display=swap');

  /* ── Mini sidebar notice cards ─────────────────────────── */
  .mnb-wrap {
    --cork:      #b98a5e;
    --cork-dark: #9c7148;
    --paper:     #faf6ee;
    --paper-warm:#f3ecd8;
    --ink:       #241c14;
    --navy:      #1c2340;
    --amber:     #f5a623;
    --coral:     #ef6a5f;
    --mint:      #35b0a0;
    --tape:      rgba(245,236,206,0.82);

    background:
      radial-gradient(circle at 20% 30%, rgba(0,0,0,0.07), transparent 50%),
      repeating-linear-gradient(45deg, var(--cork) 0px, var(--cork) 2px, var(--cork-dark) 2px, var(--cork-dark) 4px);
    border-radius: 16px;
    padding: 24px 18px 28px;
    box-shadow: inset 0 4px 16px rgba(0,0,0,0.22), 0 4px 20px rgba(0,0,0,0.14);
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .mnb-header {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: var(--amber);
    margin-bottom: -4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .mnb-header-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--amber);
    box-shadow: 0 0 0 3px rgba(245,166,35,0.25);
  }

  .mnb-card {
    position: relative;
    background: var(--paper);
    padding: 16px 14px 14px;
    box-shadow: 0 6px 16px rgba(0,0,0,0.28), 0 2px 4px rgba(0,0,0,0.14);
    background-image: repeating-linear-gradient(rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 1px, transparent 1px, transparent 24px);
  }
  .mnb-card::before {
    content: ""; position: absolute; inset: 0;
    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
    pointer-events: none;
  }
  .mnb-card.rot-neg { transform: rotate(-1.2deg); }
  .mnb-card.rot-pos { transform: rotate(0.9deg); }
  .mnb-card.rot-flat { transform: rotate(-0.4deg); }

  .mnb-tape {
    position: absolute; width: 56px; height: 20px;
    background: var(--tape);
    top: -11px; left: 50%;
    transform: translateX(-50%) rotate(-2deg);
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
  .mnb-pin {
    position: absolute; width: 13px; height: 13px; border-radius: 50%;
    top: -7px; left: 14px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.42), inset 0 -2px 2px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.3);
  }

  .mnb-label {
    font-family: 'Space Mono', monospace;
    font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
    color: var(--navy); opacity: 0.5; margin-bottom: 8px;
  }
  .mnb-card h4 {
    font-family: 'Kalam', cursive;
    font-size: 17px; margin: 0 0 10px; color: var(--navy); line-height: 1.2;
  }
  .mnb-row { display: flex; align-items: center; gap: 7px; margin-bottom: 7px; font-size: 12.5px; }
  .mnb-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .mnb-dot.live { background: var(--mint); box-shadow: 0 0 0 3px rgba(53,176,160,0.2); animation: pulse-dot 1.8s infinite; }
  .mnb-dot.soon { background: var(--amber); box-shadow: 0 0 0 3px rgba(245,166,35,0.2); }
  @keyframes pulse-dot { 0%,100%{ opacity:1 } 50%{ opacity:0.5 } }

  .mnb-badge {
    display: inline-flex; align-items: center;
    font-family: 'Space Mono', monospace; font-size: 9px; font-weight: 700;
    padding: 2px 7px; border-radius: 3px; color: #fff; letter-spacing: 0.5px;
  }
  .mnb-badge.live { background: var(--mint); }
  .mnb-badge.urgent { background: var(--coral); }
  .mnb-badge.soon { background: var(--amber); color: var(--navy); }

  /* mini seat bar */
  .mnb-seats { display: flex; gap: 3px; margin: 8px 0 6px; flex-wrap: wrap; }
  .mnb-seat { width: 12px; height: 18px; border-radius: 2px 2px 0 0; background: var(--navy); }
  .mnb-seat.open { background: var(--paper-warm); border: 1.5px dashed var(--coral); }
  .mnb-big { font-family: 'Space Mono', monospace; font-size: 26px; font-weight: 700; color: var(--coral); line-height: 1; }
  .mnb-sub { font-size: 11px; color: var(--ink); opacity: 0.6; margin-top: 2px; }

  .mnb-list { list-style: none; padding: 0; margin: 0; font-size: 12px; }
  .mnb-list li { padding: 5px 0; border-bottom: 1px dashed rgba(0,0,0,0.13); display: flex; justify-content: space-between; }
  .mnb-list li:last-child { border-bottom: none; }
  .mnb-list .val { font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700; color: var(--navy); }
`;

import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"

interface Props {
  course: any;
  durationDisplay: string;
}

export function CourseNoticeBoardMini({ course, durationDisplay }: Props) {
  const price = course?.price ? `₹${course.price.toLocaleString('en-IN')}` : 'Free';
  const now = new Date();
  const nextBatchDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const fmt = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  return (
    <div className="mnb-wrap">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Header */}
      <div className="mnb-header">
        <span className="mnb-header-dot" />
        Notice Board
      </div>

      {/* Enroll CTA Card (replacing the white card) */}
      <div className="mnb-card rot-flat" style={{ paddingBottom: '20px' }}>
        <div className="mnb-tape" />
        <div className="mnb-pin" style={{ background: '#f5a623' }} />
        <div className="mnb-label" style={{ marginBottom: '12px' }}>Enrollment</div>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          {course?.price > 0 && (
            <div style={{ fontSize: '12px', color: '#ef6a5f', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              🔥 50% Off Limited Time
            </div>
          )}
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '32px', fontWeight: 'bold', color: 'var(--navy)', lineHeight: 1 }}>
            {price}
          </div>
          {course?.price > 0 && (
            <div style={{ fontSize: '13px', color: 'var(--ink)', opacity: 0.6, marginTop: '4px' }}>
              <span style={{ textDecoration: 'line-through' }}>₹{(course.price * 2).toLocaleString('en-IN')}</span> · One-time
            </div>
          )}
        </div>
        
        <CourseInquiryDialog
          courseTitle={course?.title || 'AI-Powered Web Development'}
          buttonClassName="w-full h-12 text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-xl shadow-md"
        />
      </div>

      {/* Card 1 — Batch Status */}
      <div className="mnb-card rot-neg">
        <div className="mnb-tape" />
        <div className="mnb-pin" style={{ background: '#4c9a6a' }} />
        <div className="mnb-label">Current Batch</div>
        <h4>Running Now</h4>
        <div className="mnb-row">
          <span className="mnb-dot live" />
          <span><strong>Batch #42</strong> · Weekends</span>
        </div>
        <div className="mnb-row">
          <span className="mnb-badge live">LIVE</span>
          <span style={{ fontSize: 11, opacity: 0.7 }}>Online &amp; Home</span>
        </div>
      </div>

      {/* Card 2 — Seats */}
      <div className="mnb-card rot-pos">
        <div className="mnb-tape" />
        <div className="mnb-pin" style={{ background: '#d64541' }} />
        <div className="mnb-label">Seats Available</div>
        <h4>Only 3 Left!</h4>
        <div className="mnb-seats">
          {Array.from({ length: 12 }).map((_, i) => <div key={i} className="mnb-seat" />)}
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="mnb-seat open" />)}
        </div>
        <div className="mnb-big">3<span style={{ fontSize: 12, opacity: 0.5 }}> / 15</span></div>
        <div className="mnb-sub">12 enrolled · 3 open</div>
        <span className="mnb-badge urgent" style={{ marginTop: 8, display: 'inline-flex' }}>FILLING FAST</span>
      </div>

      {/* Card 3 — Quick Info */}
      <div className="mnb-card rot-flat">
        <div className="mnb-tape" />
        <div className="mnb-pin" style={{ background: '#3d6fb4' }} />
        <div className="mnb-label">At a Glance</div>
        <h4>Course Details</h4>
        <ul className="mnb-list">
          <li><span>Next batch</span><span className="val">{fmt(nextBatchDate)}</span></li>
          <li><span>Fee</span><span className="val">{price}</span></li>
          <li><span>Duration</span><span className="val">{durationDisplay}</span></li>
          <li><span>Home Tutors</span><span className="val" style={{ color: '#35b0a0' }}>✓ NCR</span></li>
          <li><span>Certificate</span><span className="val">Yes</span></li>
        </ul>
      </div>

    </div>
  );
}
