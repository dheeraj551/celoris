import React from 'react';
import Link from 'next/link';

export function CourseNoticeBoard({ course }: { course: any }) {
  // Extract values from course
  const title = course?.title || 'AI-Powered Web Development';
  const price = course?.price ? `₹${course.price.toLocaleString('en-IN')}` : 'Free';
  const duration = (course?.course_modules?.reduce((acc: number, curr: any) => acc + (curr.estimated_duration || 0), 0) || 0) / 60;
  const durationDisplay = duration > 0 ? `${Math.round(duration / 24)} weeks` : '6-8 weeks';
  
  // Calculate dates
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const formatDate = (d: Date) => d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  
  return (
    <div className="notice-board-wrapper my-12">
      <style dangerouslySetInnerHTML={{ __html: `
        .notice-board-wrapper {
          --cork: #b98a5e;
          --cork-dark: #9c7148;
          --paper: #faf6ee;
          --paper-warm: #f3ecd8;
          --ink: #241c14;
          --navy: #1c2340;
          --amber: #f5a623;
          --coral: #ef6a5f;
          --mint: #35b0a0;
          --pin-red: #d64541;
          --pin-blue: #3d6fb4;
          --pin-green: #4c9a6a;
          --tape: rgba(245,236,206,0.75);
          
          font-family: 'DM Sans', sans-serif;
          color: var(--ink);
          background:
            radial-gradient(circle at 20% 20%, rgba(0,0,0,0.06), transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(0,0,0,0.08), transparent 45%),
            repeating-linear-gradient(45deg, var(--cork) 0px, var(--cork) 2px, var(--cork-dark) 2px, var(--cork-dark) 4px);
          padding: 40px 24px 60px;
          border-radius: 24px;
          box-shadow: inset 0 10px 20px rgba(0,0,0,0.2);
          overflow: hidden;
        }
        .notice-board-wrapper * { box-sizing: border-box; }
        .nb-board { max-width: 1080px; margin: 0 auto; position: relative; }
        .nb-banner {
          position: relative;
          background: var(--navy);
          color: var(--paper);
          padding: 26px 32px 30px;
          margin: 0 auto 46px;
          max-width: 760px;
          text-align: center;
          transform: rotate(-0.6deg);
          box-shadow: 0 10px 24px rgba(0,0,0,0.35);
          clip-path: polygon(0% 4%, 3% 0%, 8% 3%, 15% 0%, 22% 3%, 30% 0%, 38% 2%, 46% 0%, 54% 3%, 62% 0%, 70% 2%, 78% 0%, 86% 3%, 93% 0%, 100% 4%, 100% 96%, 94% 100%, 87% 97%, 79% 100%, 71% 97%, 63% 100%, 55% 98%, 47% 100%, 39% 97%, 31% 100%, 23% 98%, 16% 100%, 8% 97%, 0% 100%);
        }
        .nb-banner .nb-eyebrow { font-family: 'Space Mono', monospace; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: var(--amber); margin-bottom: 8px; }
        .nb-banner h1 { font-family: 'Kalam', cursive; font-size: clamp(28px, 5vw, 42px); margin: 0 0 6px; line-height: 1.15; }
        .nb-banner p { margin: 0; font-size: 14px; opacity: 0.85; }
        .nb-pin { position: absolute; width: 16px; height: 16px; border-radius: 50%; top: -8px; box-shadow: 0 3px 4px rgba(0,0,0,0.45), inset 0 -2px 3px rgba(0,0,0,0.3), inset 0 2px 2px rgba(255,255,255,0.4); }
        .nb-pin.left { left: 34px; background: var(--pin-red); }
        .nb-pin.right { right: 34px; background: var(--pin-blue); }
        .nb-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px 26px; }
        @media (max-width: 860px) { .nb-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px) { .nb-grid { grid-template-columns: 1fr; } }
        .nb-card {
          position: relative;
          background: var(--paper);
          padding: 22px 20px 20px;
          box-shadow: 0 8px 18px rgba(0,0,0,0.28), 0 2px 4px rgba(0,0,0,0.15);
          background-image: repeating-linear-gradient(rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 1px, transparent 1px, transparent 26px);
        }
        .nb-card::before { content: ""; position: absolute; inset: 0; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.04); pointer-events: none; }
        .nb-card .nb-pin { top: -9px; }
        .nb-card.r1 { transform: rotate(-1.4deg); }
        .nb-card.r2 { transform: rotate(1deg); }
        .nb-card.r3 { transform: rotate(-0.6deg); }
        .nb-card.r4 { transform: rotate(1.6deg); }
        .nb-card.r5 { transform: rotate(-1deg); }
        .nb-card.r6 { transform: rotate(0.8deg); }
        .nb-tape { position: absolute; width: 70px; height: 26px; background: var(--tape); top: -14px; left: 50%; transform: translateX(-50%) rotate(-3deg); box-shadow: 0 1px 3px rgba(0,0,0,0.25); }
        .nb-label { font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--navy); opacity: 0.65; margin: 4px 0 10px; }
        .nb-card h2 { font-family: 'Kalam', cursive; font-size: 22px; margin: 0 0 12px; color: var(--navy); }
        .nb-status-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-size: 14.5px; }
        .nb-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .nb-dot.live { background: var(--mint); box-shadow: 0 0 0 4px rgba(53,176,160,0.18); }
        .nb-dot.soon { background: var(--amber); box-shadow: 0 0 0 4px rgba(245,166,35,0.18); }
        .nb-badge { display: inline-block; font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 3px; color: #fff; letter-spacing: 0.5px; }
        .nb-badge.live { background: var(--mint); }
        .nb-badge.soon { background: var(--amber); color: var(--navy); }
        .nb-badge.urgent { background: var(--coral); }
        .nb-slots-visual { display: flex; gap: 6px; margin: 14px 0 12px; }
        .nb-seat { width: 20px; height: 26px; border-radius: 3px 3px 0 0; background: var(--navy); }
        .nb-seat.open { background: var(--paper-warm); border: 2px dashed var(--coral); }
        .nb-slots-number { font-family: 'Space Mono', monospace; font-size: 34px; font-weight: 700; color: var(--coral); line-height: 1; }
        .nb-slots-sub { font-size: 13px; color: var(--ink); opacity: 0.75; margin-top: 2px; }
        .nb-trainer-count { display: flex; align-items: baseline; gap: 8px; margin: 8px 0 10px; }
        .nb-trainer-count .nb-num { font-family: 'Space Mono', monospace; font-size: 40px; font-weight: 700; color: var(--navy); }
        .nb-avatars { display: flex; margin: 6px 0 4px; }
        .nb-avatars span { width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg, var(--mint), var(--navy)); border: 2px solid var(--paper); margin-left: -8px; font-family: 'Space Mono', monospace; font-size: 10px; color: #fff; display: flex; align-items: center; justify-content: center; }
        .nb-avatars span:first-child { margin-left: 0; }
        .nb-card ul.plain { list-style: none; padding: 0; margin: 0; font-size: 14px; }
        .nb-card ul.plain li { padding: 7px 0; border-bottom: 1px dashed rgba(0,0,0,0.15); display: flex; justify-content: space-between; gap: 8px; }
        .nb-card ul.plain li:last-child { border-bottom: none; }
        .nb-card ul.plain .nb-date { font-family: 'Space Mono', monospace; font-size: 12.5px; color: var(--navy); font-weight: 700; white-space: nowrap; }
        .nb-cta-card { background: var(--navy); color: var(--paper); }
        .nb-cta-card h2 { color: var(--amber); }
        .nb-cta-card .nb-label { color: var(--paper); opacity: 0.6; }
        .nb-cta-card p { font-size: 14px; line-height: 1.5; margin: 0 0 16px; }
        .nb-cta-btn { display: inline-block; background: var(--amber); color: var(--navy); font-weight: 700; font-family: 'DM Sans', sans-serif; font-size: 14px; padding: 10px 18px; border-radius: 4px; text-decoration: none; cursor: pointer; border: none; }
        .nb-cta-btn:hover { background: #f0a020; }
        .nb-home-tutor-note { grid-column: span 3; }
        @media (max-width: 860px) { .nb-home-tutor-note { grid-column: span 2; } }
        @media (max-width: 580px) { .nb-home-tutor-note { grid-column: span 1; } }
        .nb-home-tutor-note .nb-row { display: flex; flex-wrap: wrap; gap: 18px 30px; align-items: center; justify-content: space-around; }
        .nb-stat { text-align: center; }
        .nb-stat .nb-n { font-family: 'Space Mono', monospace; font-weight: 700; font-size: 28px; color: var(--navy); }
        .nb-stat .nb-t { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.6; }
        .nb-footer { text-align: center; margin-top: 40px; color: var(--paper); font-family: 'Space Mono', monospace; font-size: 11px; opacity: 0.75; letter-spacing: 1px; }
      `}} />

      <div className="nb-board">
        <div className="nb-banner">
          <div className="nb-pin left"></div>
          <div className="nb-pin right"></div>
          <div className="nb-eyebrow">Celoris · Notice Board</div>
          <h1>{title}</h1>
          <p>Live batch updates · seats · trainers · what's next — pinned right here</p>
        </div>
        
        <div className="nb-grid">
          {/* Batch running */}
          <div className="nb-card r1">
            <div className="nb-tape"></div>
            <div className="nb-pin left" style={{background: 'var(--pin-green)'}}></div>
            <div className="nb-label">Current batch</div>
            <h2>Running Now</h2>
            <div className="nb-status-row">
              <span className="nb-dot live"></span>
              <span><strong>Batch #42</strong></span>
            </div>
            <div className="nb-status-row">
              <span className="nb-badge live">LIVE</span>
              <span style={{fontSize: '13px'}}>Classes on-going · Weekends</span>
            </div>
            <div className="nb-status-row" style={{marginBottom: 0}}>
              <span style={{fontSize: '13px', opacity: 0.75}}>Mode: Online & Home Tuition</span>
            </div>
          </div>
          
          {/* Available Slots */}
          <div className="nb-card r2">
            <div className="nb-tape"></div>
            <div className="nb-pin left" style={{background: 'var(--pin-red)'}}></div>
            <div className="nb-label">Seats</div>
            <h2>Available Slots</h2>
            <div className="nb-slots-visual">
              <div className="nb-seat"></div><div className="nb-seat"></div><div className="nb-seat"></div><div className="nb-seat"></div>
              <div className="nb-seat"></div><div className="nb-seat"></div><div className="nb-seat"></div><div className="nb-seat"></div>
              <div className="nb-seat"></div><div className="nb-seat"></div><div className="nb-seat"></div><div className="nb-seat"></div>
              <div className="nb-seat open"></div><div className="nb-seat open"></div><div className="nb-seat open"></div>
            </div>
            <div className="nb-slots-number">3<span style={{fontSize: '16px', opacity: 0.6}}> / 15</span></div>
            <div className="nb-slots-sub">12 students enrolled · 3 seats open</div>
            <span className="nb-badge urgent" style={{marginTop: '10px', display: 'inline-block'}}>FILLING FAST</span>
          </div>
          
          {/* Upcoming batch */}
          <div className="nb-card r3">
            <div className="nb-tape"></div>
            <div className="nb-pin left" style={{background: 'var(--pin-blue)'}}></div>
            <div className="nb-label">Next intake</div>
            <h2>Upcoming Batch</h2>
            <div className="nb-status-row">
              <span className="nb-dot soon"></span>
              <span><strong>Batch #43</strong></span>
            </div>
            <div className="nb-status-row">
              <span className="nb-badge soon">OPENING SOON</span>
            </div>
            <ul className="plain" style={{marginTop: '8px'}}>
              <li><span>Starts</span> <span className="nb-date">{formatDate(nextMonth)}</span></li>
              <li><span>Registration closes</span> <span className="nb-date">{formatDate(new Date(now.getFullYear(), now.getMonth() + 1, -5))}</span></li>
            </ul>
          </div>
          
          {/* Trainers */}
          <div className="nb-card r4">
            <div className="nb-tape"></div>
            <div className="nb-pin left" style={{background: 'var(--pin-green)'}}></div>
            <div className="nb-label">Faculty</div>
            <h2>Trainers Available</h2>
            <div className="nb-trainer-count">
              <span className="nb-num">13</span>
              <span style={{fontSize: '13px', opacity: 0.7}}>verified trainers<br/>on this course</span>
            </div>
            <div className="nb-avatars">
              <span>RM</span><span>PS</span><span>AV</span><span>NK</span><span>SC</span>
              <span style={{background: 'var(--amber)', color: 'var(--navy)'}}>+8</span>
            </div>
            <div style={{fontSize: '12.5px', opacity: 0.7, marginTop: '6px'}}>Online & Home Tutors</div>
          </div>
          
          {/* Home tutors */}
          <div className="nb-card r5">
            <div className="nb-tape"></div>
            <div className="nb-pin left" style={{background: 'var(--pin-red)'}}></div>
            <div className="nb-label">In-person option</div>
            <h2>Home Tutors</h2>
            <div className="nb-status-row">
              <span className="nb-dot live"></span>
              <span style={{fontSize: '14px'}}>Home tuition available</span>
            </div>
            <ul className="plain">
              <li><span>Coverage</span> <span className="nb-date">Delhi / NCR</span></li>
              <li><span>Home tutors on roster</span> <span className="nb-date">7</span></li>
            </ul>
          </div>
          
          {/* More info / misc */}
          <div className="nb-card r6">
            <div className="nb-tape"></div>
            <div className="nb-pin left" style={{background: 'var(--pin-blue)'}}></div>
            <div className="nb-label">Good to know</div>
            <h2>More Details</h2>
            <ul className="plain">
              <li><span>Course fee</span> <span className="nb-date">{price}</span></li>
              <li><span>Duration</span> <span className="nb-date">{durationDisplay}</span></li>
              <li><span>Certificate</span> <span className="nb-date">Yes</span></li>
              <li><span>Demo class</span> <span className="nb-date">Free</span></li>
            </ul>
          </div>
          
          {/* Wide summary strip */}
          <div className="nb-card nb-home-tutor-note r1" style={{transform: 'rotate(-0.3deg)'}}>
            <div className="nb-tape"></div>
            <div className="nb-pin left" style={{background: 'var(--pin-green)'}}></div>
            <div className="nb-label">At a glance</div>
            <div className="nb-row">
              <div className="nb-stat"><div className="nb-n">12/15</div><div className="nb-t">Seats filled</div></div>
              <div className="nb-stat"><div className="nb-n">3</div><div className="nb-t">Seats left</div></div>
              <div className="nb-stat"><div className="nb-n">13</div><div className="nb-t">Trainers</div></div>
              <div className="nb-stat"><div className="nb-n">2</div><div className="nb-t">Active batches</div></div>
              <div className="nb-stat"><div className="nb-n">NCR</div><div className="nb-t">Home tuition zone</div></div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="nb-card nb-cta-card r2" style={{gridColumn: 'span 3'}}>
            <div className="nb-tape"></div>
            <div className="nb-pin left" style={{background: 'var(--pin-red)'}}></div>
            <div className="nb-label">Enroll</div>
            <h2>Only 3 Seats Left — Reserve Yours</h2>
            <p>Lock your seat before the current batch closes and get access to top-tier trainers.</p>
            <button className="nb-cta-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Enroll Now →
            </button>
          </div>
        </div>
        <div className="nb-footer">PINNED BY CELORIS · UPDATED LIVE</div>
      </div>
    </div>
  );
}
