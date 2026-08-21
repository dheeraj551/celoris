"use client"

import React from 'react';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Space+Mono:wght@400;700&display=swap');

  .nb-wrap {
    --cork:      #b98a5e;
    --cork-dark: #9c7148;
    --paper:     #faf6ee;
    --paper-warm:#f3ecd8;
    --ink:       #241c14;
    --navy:      #1c2340;
    --amber:     #f5a623;
    --coral:     #ef6a5f;
    --mint:      #35b0a0;
    --pin-red:   #d64541;
    --pin-blue:  #3d6fb4;
    --pin-green: #4c9a6a;
    --tape:      rgba(245,236,206,0.78);

    background:
      radial-gradient(circle at 15% 30%, rgba(0,0,0,0.07), transparent 40%),
      radial-gradient(circle at 85% 60%, rgba(0,0,0,0.09), transparent 45%),
      repeating-linear-gradient(45deg, var(--cork) 0px, var(--cork) 2px, var(--cork-dark) 2px, var(--cork-dark) 4px);
    border-radius: 20px;
    padding: 48px 40px 52px;
    box-shadow: inset 0 6px 24px rgba(0,0,0,0.22), 0 8px 32px rgba(0,0,0,0.15);
    font-family: 'DM Sans', sans-serif;
    overflow: hidden;
    position: relative;
  }

  /* ── section header ─────────────────────────────────────── */
  .nb-section-eyebrow {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--amber);
    margin-bottom: 6px;
  }
  .nb-section-title {
    font-family: 'Kalam', cursive;
    font-size: clamp(24px, 3.5vw, 36px);
    color: var(--paper);
    margin: 0 0 4px;
    line-height: 1.15;
  }
  .nb-section-sub {
    font-size: 13px;
    color: rgba(250,246,238,0.70);
    margin: 0 0 40px;
  }

  /* ── banner pin ─────────────────────────────────────────── */
  .nb-hdr-pin {
    display: inline-block;
    width: 14px; height: 14px;
    border-radius: 50%;
    vertical-align: middle;
    margin-right: 10px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.4), inset 0 -1px 2px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.35);
  }

  /* ── cards row ──────────────────────────────────────────── */
  .nb-cards-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
  @media (max-width: 900px) { .nb-cards-row { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px) { .nb-cards-row { grid-template-columns: 1fr; } }

  /* ── individual card ────────────────────────────────────── */
  .nb-card {
    position: relative;
    background: var(--paper);
    padding: 24px 20px 20px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.30), 0 2px 6px rgba(0,0,0,0.18);
    background-image: repeating-linear-gradient(rgba(0,0,0,0.022) 0px, rgba(0,0,0,0.022) 1px, transparent 1px, transparent 28px);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .nb-card:hover {
    transform: translateY(-4px) rotate(0deg) !important;
    box-shadow: 0 14px 32px rgba(0,0,0,0.38), 0 4px 8px rgba(0,0,0,0.2);
  }
  .nb-card::before {
    content: "";
    position: absolute; inset: 0;
    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
    pointer-events: none;
  }

  /* rotations */
  .nb-r1 { transform: rotate(-1.3deg); }
  .nb-r2 { transform: rotate(1.1deg); }
  .nb-r3 { transform: rotate(-0.8deg); }
  .nb-r4 { transform: rotate(1.5deg); }

  /* ── tape & pin ─────────────────────────────────────────── */
  .nb-tape {
    position: absolute;
    width: 64px; height: 24px;
    background: var(--tape);
    top: -13px; left: 50%;
    transform: translateX(-50%) rotate(-2deg);
    box-shadow: 0 1px 3px rgba(0,0,0,0.22);
  }
  .nb-pin {
    position: absolute;
    width: 15px; height: 15px;
    border-radius: 50%;
    top: -8px; left: 20px;
    box-shadow: 0 3px 4px rgba(0,0,0,0.45), inset 0 -2px 3px rgba(0,0,0,0.28), inset 0 2px 2px rgba(255,255,255,0.35);
  }

  /* ── card internals ─────────────────────────────────────── */
  .nb-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--navy);
    opacity: 0.55;
    margin-bottom: 10px;
  }
  .nb-card h3 {
    font-family: 'Kalam', cursive;
    font-size: 21px;
    margin: 0 0 14px;
    color: var(--navy);
    line-height: 1.2;
  }
  .nb-row { display: flex; align-items: center; gap: 8px; margin-bottom: 9px; font-size: 13.5px; }
  .nb-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
  .nb-dot.live { background: var(--mint); box-shadow: 0 0 0 3px rgba(53,176,160,0.2); }
  .nb-dot.soon { background: var(--amber); box-shadow: 0 0 0 3px rgba(245,166,35,0.2); }
  .nb-badge {
    display: inline-flex; align-items: center;
    font-family: 'Space Mono', monospace;
    font-size: 10px; font-weight: 700;
    padding: 2px 8px; border-radius: 3px;
    color: #fff; letter-spacing: 0.5px;
  }
  .nb-badge.live    { background: var(--mint); }
  .nb-badge.soon    { background: var(--amber); color: var(--navy); }
  .nb-badge.urgent  { background: var(--coral); }

  /* slot visual */
  .nb-seats { display: flex; gap: 5px; margin: 12px 0 10px; flex-wrap: wrap; }
  .nb-seat { width: 18px; height: 24px; border-radius: 3px 3px 0 0; background: var(--navy); }
  .nb-seat.open { background: var(--paper-warm); border: 1.5px dashed var(--coral); }
  .nb-big { font-family: 'Space Mono', monospace; font-size: 32px; font-weight: 700; color: var(--coral); line-height: 1; }
  .nb-sub { font-size: 12px; color: var(--ink); opacity: 0.65; margin-top: 2px; }

  /* trainer avatars */
  .nb-avatars { display: flex; margin: 8px 0 6px; }
  .nb-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, var(--mint), var(--navy));
    border: 2px solid var(--paper);
    margin-left: -8px;
    font-family: 'Space Mono', monospace;
    font-size: 9px; color: #fff;
    display: flex; align-items: center; justify-content: center;
  }
  .nb-avatar:first-child { margin-left: 0; }
  .nb-big-num { font-family: 'Space Mono', monospace; font-size: 38px; font-weight: 700; color: var(--navy); line-height: 1; }

  /* list */
  .nb-list { list-style: none; padding: 0; margin: 0; font-size: 13px; }
  .nb-list li { padding: 6px 0; border-bottom: 1px dashed rgba(0,0,0,0.14); display: flex; justify-content: space-between; gap: 8px; }
  .nb-list li:last-child { border-bottom: none; }
  .nb-list .nb-val { font-family: 'Space Mono', monospace; font-size: 12px; color: var(--navy); font-weight: 700; white-space: nowrap; }

  /* ── bottom stat strip ──────────────────────────────────── */
  .nb-strip {
    margin-top: 32px;
    background: rgba(28,35,64,0.85);
    border-radius: 14px;
    padding: 22px 32px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px 40px;
    align-items: center;
    justify-content: space-between;
  }
  .nb-stat { text-align: center; }
  .nb-stat .nb-n { font-family: 'Space Mono', monospace; font-size: 26px; font-weight: 700; color: var(--amber); line-height: 1; }
  .nb-stat .nb-t { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: rgba(250,246,238,0.55); margin-top: 3px; }
  .nb-strip-cta {
    background: var(--amber);
    color: var(--navy);
    font-weight: 700;
    font-size: 14px;
    padding: 10px 22px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
    transition: background 0.15s;
  }
  .nb-strip-cta:hover { background: #f0a015; }
`;

export function CourseNoticeBoard({ course }: { course: any }) {
  const title   = course?.title || 'AI-Powered Web Development';
  const price   = course?.price ? `₹${course.price.toLocaleString('en-IN')}` : 'Free';
  const totalModules = course?.course_modules?.length || 0;
  const totalMins    = course?.course_modules?.reduce((a: number, m: any) => a + (m.estimated_duration || 0), 0) || 0;
  const durationDisplay = totalMins > 60 ? `${Math.round(totalMins / 60 / 24)} weeks` : '6–8 weeks';

  const now = new Date();
  const nextMonthFirst = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const regClose       = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 17);
  const fmt = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  return (
    <div className="nb-wrap">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── Header ───────────────────────────────────────── */}
      <div className="mb-2">
        <span className="nb-hdr-pin" style={{ background: '#d64541' }} />
        <span className="nb-hdr-pin" style={{ background: '#3d6fb4' }} />
        <p className="nb-section-eyebrow" style={{ display: 'inline', marginLeft: 12 }}>Celoris · Notice Board</p>
      </div>
      <h2 className="nb-section-title">{title}</h2>
      <p className="nb-section-sub">Live batch updates · seats · trainers · what&apos;s next — pinned right here</p>

      {/* ── 4-column cards ───────────────────────────────── */}
      <div className="nb-cards-row">

        {/* Card 1 – Current Batch */}
        <div className="nb-card nb-r1">
          <div className="nb-tape" />
          <div className="nb-pin" style={{ background: '#4c9a6a' }} />
          <div className="nb-label">Current Batch</div>
          <h3>Running Now</h3>
          <div className="nb-row">
            <span className="nb-dot live" />
            <strong>Batch #42</strong>
          </div>
          <div className="nb-row">
            <span className="nb-badge live">LIVE</span>
            <span style={{ fontSize: 12 }}>Weekends · Online &amp; Home</span>
          </div>
          <div className="nb-row" style={{ marginBottom: 0, opacity: 0.65, fontSize: 12 }}>
            Mode: Online &amp; Home Tuition
          </div>
        </div>

        {/* Card 2 – Available Slots */}
        <div className="nb-card nb-r2">
          <div className="nb-tape" />
          <div className="nb-pin" style={{ background: '#d64541' }} />
          <div className="nb-label">Seats</div>
          <h3>Available Slots</h3>
          <div className="nb-seats">
            {Array.from({ length: 12 }).map((_, i) => <div key={i} className="nb-seat" />)}
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="nb-seat open" />)}
          </div>
          <div className="nb-big">3<span style={{ fontSize: 14, opacity: 0.55 }}> / 15</span></div>
          <div className="nb-sub">12 enrolled · 3 seats open</div>
          <span className="nb-badge urgent" style={{ marginTop: 10, display: 'inline-flex' }}>FILLING FAST</span>
        </div>

        {/* Card 3 – Upcoming Batch */}
        <div className="nb-card nb-r3">
          <div className="nb-tape" />
          <div className="nb-pin" style={{ background: '#3d6fb4' }} />
          <div className="nb-label">Next Intake</div>
          <h3>Upcoming Batch</h3>
          <div className="nb-row">
            <span className="nb-dot soon" />
            <strong>Batch #43</strong>
          </div>
          <span className="nb-badge soon">OPENING SOON</span>
          <ul className="nb-list" style={{ marginTop: 12 }}>
            <li><span>Starts</span><span className="nb-val">{fmt(nextMonthFirst)}</span></li>
            <li><span>Reg. closes</span><span className="nb-val">{fmt(regClose)}</span></li>
          </ul>
        </div>

        {/* Card 4 – Trainers */}
        <div className="nb-card nb-r4">
          <div className="nb-tape" />
          <div className="nb-pin" style={{ background: '#4c9a6a' }} />
          <div className="nb-label">Faculty</div>
          <h3>Trainers &amp; Home Tutors</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span className="nb-big-num">13</span>
            <span style={{ fontSize: 12, opacity: 0.65 }}>verified<br/>trainers</span>
          </div>
          <div className="nb-avatars">
            {['RM','PS','AV','NK','SC'].map(i => <div key={i} className="nb-avatar">{i}</div>)}
            <div className="nb-avatar" style={{ background: 'linear-gradient(135deg,#f5a623,#ef6a5f)', color: '#1c2340' }}>+8</div>
          </div>
          <div style={{ fontSize: 12, opacity: 0.65, marginTop: 6 }}>
            <strong>Home Tutors:</strong> Delhi / NCR · 7 available
          </div>
        </div>

      </div>

      {/* ── Bottom strip ─────────────────────────────────── */}
      <div className="nb-strip">
        <div className="nb-stat"><div className="nb-n">12/15</div><div className="nb-t">Seats Filled</div></div>
        <div className="nb-stat"><div className="nb-n">3</div><div className="nb-t">Seats Left</div></div>
        <div className="nb-stat"><div className="nb-n">13</div><div className="nb-t">Trainers</div></div>
        <div className="nb-stat"><div className="nb-n">2</div><div className="nb-t">Batches Active</div></div>
        <div className="nb-stat"><div className="nb-n">{price}</div><div className="nb-t">Course Fee</div></div>
        <div className="nb-stat"><div className="nb-n">{durationDisplay}</div><div className="nb-t">Duration</div></div>
        <div className="nb-stat"><div className="nb-n">NCR</div><div className="nb-t">Home Tuition Zone</div></div>
        <button
          className="nb-strip-cta"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Only 3 Seats Left — Enroll Now →
        </button>
      </div>
    </div>
  );
}
