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
  .mnb-date { display:flex; align-items:center; gap:10px; background:#fff; border:1.5px solid rgba(28,35,64,.12); border-radius:8px; padding:8px 10px; margin:0 0 10px; }
  .mnb-date-cal { width:40px; flex-shrink:0; border-radius:6px; overflow:hidden; text-align:center; box-shadow:0 2px 0 rgba(0,0,0,.15); }
  .mnb-date-cal span { display:block; background:var(--coral); color:#fff; font-family:'Space Mono',monospace; font-size:9px; font-weight:700; letter-spacing:1px; padding:2px 0; }
  .mnb-date-cal b { display:block; background:var(--paper); color:var(--navy); font-family:'Space Mono',monospace; font-size:18px; line-height:1.3; }
  .mnb-date-k { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:1.5px; text-transform:uppercase; color:var(--coral); font-weight:700; }
  .mnb-date-v { font-size:14px; font-weight:800; color:var(--navy); line-height:1.2; }
  .mnb-date-t { font-size:11.5px; color:var(--ink); opacity:.7; }
  .mnb-trainers { margin-top:8px; padding-top:8px; border-top:1px dashed rgba(0,0,0,0.14); }
  .mnb-trainers-k { font-family:'Space Mono',monospace; font-size:9px; letter-spacing:1.5px; text-transform:uppercase; color:var(--navy); opacity:.55; margin-bottom:5px; }
  .mnb-avs { display:flex; margin-bottom:5px; }
  .mnb-av { width:26px; height:26px; border-radius:50%; border:2px solid var(--paper); margin-left:-7px; object-fit:cover; background:linear-gradient(135deg,var(--mint),var(--navy)); color:#fff; font-family:'Space Mono',monospace; font-size:9px; display:inline-flex; align-items:center; justify-content:center; }
  .mnb-av:first-child { margin-left:0; }
  .mnb-trainers-n { font-size:11.5px; color:var(--ink); opacity:.8; line-height:1.4; }
  .mnb-list .val { font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700; color: var(--navy); }
`;

import { LaunchOfferCard } from "@/components/learn/CourseLaunchOffer"
import { istFullDate, istTime, type CourseBatchInfo } from "@/lib/course-batch-types"

interface Props {
  course: any;
  durationDisplay: string;
  /** Live figures from the course's linked classroom (see lib/course-batch.ts). */
  batch?: CourseBatchInfo | null;
  onBatchChanged?: () => void;
}

// Legacy per-course figures for courses that are NOT linked to a live
// classroom yet: the admin-entered batch_number / seats_total / batch_status,
// or the old hand-entered demo numbers. Courses with a linked classroom use
// live data instead (liveStats below).
function getBatchStats(course: any) {
  const title = (course?.title || '').toLowerCase();

  const hasRealBatchData = course?.batch_number != null || course?.seats_total != null || course?.batch_status != null;
  if (hasRealBatchData) {
    const seatsTotal = course.seats_total ?? 0;
    const seatsOpen = course.seats_left ?? 0;
    const seatsEnrolled = Math.max(seatsTotal - seatsOpen, 0);
    const status = course.batch_status || (seatsOpen > 0 ? 'Open' : 'Full');
    const statusLower = status.toLowerCase();
    const isFull = statusLower.includes('full') || seatsOpen <= 0;
    const isSoon = statusLower.includes('soon');

    return {
      batchLabel: status,
      batchDotClass: isFull || isSoon ? 'soon' : 'live',
      batchBadgeClass: isFull ? 'urgent' : isSoon ? 'soon' : 'live',
      batchBadgeText: status.toUpperCase(),
      batchNumber: course.batch_number ? `#${course.batch_number}` : '—',
      seatsOpen,
      seatsTotal,
      seatsEnrolled,
      seatsBadgeText: isFull ? 'FULLY BOOKED' : seatsOpen <= 2 ? 'FILLING FAST' : 'SEATS OPEN',
      homeTutorAvailable: !!course.home_tutor_available,
    };
  }

  if (title.includes('copilot')) {
    return {
      batchLabel: 'Starting Soon',
      batchDotClass: 'live',
      batchBadgeClass: 'urgent',
      batchBadgeText: '13 OCT 7 PM',
      batchNumber: '#08',
      seatsOpen: 15,
      seatsTotal: 15,
      seatsEnrolled: 0,
      seatsBadgeText: 'PASSES OPEN',
      homeTutorAvailable: true,
      nextBatchDate: '20 Oct',
    };
  }

  if (title.includes('digital marketing')) {
    return {
      batchLabel: 'Starting Tonight',
      batchDotClass: 'live',
      batchBadgeClass: 'urgent',
      batchBadgeText: 'TONIGHT 8 PM',
      batchNumber: '#43',
      seatsOpen: 5,
      seatsTotal: 15,
      seatsEnrolled: 10,
      seatsBadgeText: 'FILLING FAST',
      homeTutorAvailable: true,
      nextBatchDate: '11 Oct',
    };
  }

  // Default — preserves existing behavior for every other course.
  return {
    batchLabel: 'Running Now',
    batchDotClass: 'live',
    batchBadgeClass: 'live',
    batchBadgeText: 'LIVE',
    batchNumber: '#42',
    seatsOpen: 3,
    seatsTotal: 15,
    seatsEnrolled: 12,
    seatsBadgeText: 'FILLING FAST',
    homeTutorAvailable: true,
  };
}

/** Status line for a course with a linked live classroom. */
export function liveBatchStatus(batch: CourseBatchInfo) {
  if (batch.isLive) return { label: 'Class Live Now', dot: 'live', badge: 'live', badgeText: 'LIVE NOW' };
  if (!batch.nextStart) return { label: 'Being Scheduled', dot: 'soon', badge: 'soon', badgeText: 'DATE SOON' };
  if (!batch.batchStarted) {
    const isToday = batch.batchStart && new Date(batch.batchStart).toDateString() === new Date().toDateString();
    return {
      label: isToday ? 'Starting Tonight' : 'Starting Soon',
      dot: 'live',
      badge: isToday ? 'urgent' : 'soon',
      badgeText: isToday ? 'TONIGHT 8 PM' : 'STARTING SOON'
    };
  }
  return { label: 'Running Now', dot: 'live', badge: 'live', badgeText: 'RUNNING' };
}

export function CourseNoticeBoardMini({ course, durationDisplay, batch, onBatchChanged }: Props) {
  const legacy = getBatchStats(course);
  const live = batch && (batch.roomId || batch.batchStart) ? batch : null;
  const price = Number(course?.price) > 0 ? `₹${Number(course.price).toLocaleString('en-IN')}` : 'Free';

  // Seats: the linked classroom's capacity vs. students who applied.
  const seatsTotal = live?.seatsTotal ?? legacy.seatsTotal;
  const seatsOpen = live ? (live.seatsLeft ?? 0) : legacy.seatsOpen;
  const seatsTaken = Math.max(0, Math.min(seatsTotal, seatsTotal - seatsOpen));
  const seatsBadge = seatsOpen <= 0 ? 'FULLY BOOKED' : seatsOpen <= 2 ? 'FILLING FAST' : 'SEATS OPEN';
  const status = live
    ? liveBatchStatus(live)
    : { label: legacy.batchLabel, dot: legacy.batchDotClass, badge: legacy.batchBadgeClass, badgeText: legacy.batchBadgeText };
  const batchNumber = live?.batchNumber ? `#${live.batchNumber}` : legacy.batchNumber;
  const scheduleText = live?.scheduleLabel || (live ? 'Live online classes' : 'Weekends');
  const homeTutors = live ? !!course?.home_tutor_available : legacy.homeTutorAvailable;

  // Old fallback (no linked classroom): first day of next month, as before.
  const now = new Date();
  const legacyNext = (legacy as any).nextBatchDate || new Date(now.getFullYear(), now.getMonth() + 1, 1).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const nextBatchDisplay = live?.nextBatchDate || (legacy as any).nextBatchDate || legacyNext;
  const nextLabel = live ? (live.batchStarted ? 'Next class' : 'Batch starts') : 'Next batch';
  // The date that matters right now: the batch start before it begins, the
  // next class after that.
  const keyDate = live ? (live.batchStarted ? live.nextStart : live.batchStart) : null;
  const nextValue = live ? (keyDate ? `${istFullDate(keyDate)}, ${istTime(keyDate)}` : 'TBA') : legacyNext;
  const trainers = live?.trainers?.length ? live.trainers : live?.trainerName ? [{ name: live.trainerName, avatarUrl: null }] : [];
  const initials = (n: string) => n.split(/\s+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="mnb-wrap">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Header */}
      <div className="mnb-header">
        <span className="mnb-header-dot" />
        Notice Board
      </div>

      {/* Enrollment — live launch offer / fee / free card */}
      <div className="mnb-card rot-flat" style={{ paddingBottom: '18px' }} id="enroll" data-enroll>
        <div className="mnb-tape" />
        <div className="mnb-pin" style={{ background: '#f5a623' }} />
        <div className="mnb-label" style={{ marginBottom: '10px' }}>Enrollment</div>

        {batch?.soldOutNotice && (
          <div style={{
            background: '#1c2340',
            color: '#faf6ee',
            borderRadius: 8,
            padding: '7px 10px',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 6,
            fontSize: 11,
            fontWeight: 700,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef6a5f' }} />
              <span style={{ textDecoration: 'line-through', opacity: 0.7, fontSize: 10 }}>{batch.soldOutNotice}</span>
            </div>
            <span style={{
              background: 'rgba(53, 176, 160, 0.25)',
              color: '#35b0a0',
              borderRadius: 4,
              padding: '2px 6px',
              fontSize: 9.5,
              textTransform: 'uppercase',
            }}>
              Batch {batchNumber} Open
            </span>
          </div>
        )}

        <LaunchOfferCard course={course} batch={batch ?? null} onChanged={onBatchChanged} />
      </div>

      {/* Card 1 — Batch Status */}
      <div className="mnb-card rot-neg">
        <div className="mnb-tape" />
        <div className="mnb-pin" style={{ background: '#4c9a6a' }} />
        <div className="mnb-label">Current Batch</div>
        <h4>{status.label}</h4>
        {live && keyDate && (
          <div className="mnb-date">
            <div className="mnb-date-cal" aria-hidden>
              <span>{new Date(keyDate).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', month: 'short' }).toUpperCase()}</span>
              <b>{new Date(keyDate).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric' })}</b>
            </div>
            <div>
              <div className="mnb-date-k">{live.batchStarted ? 'Next class' : 'Starts'}</div>
              <div className="mnb-date-v">{istFullDate(keyDate)}</div>
              <div className="mnb-date-t">{istTime(keyDate)} IST{live.repeatsWeekly ? ' · then weekly' : ''}</div>
            </div>
          </div>
        )}
        <div className="mnb-row">
          <span className={`mnb-dot ${status.dot}`} />
          <span><strong>Batch {batchNumber}</strong> · {scheduleText}</span>
        </div>
        <div className="mnb-row">
          <span className={`mnb-badge ${status.badge}`}>{status.badgeText}</span>
          <span style={{ fontSize: 11, opacity: 0.7 }}>{homeTutors ? 'Online & Home' : 'Online · Live classroom'}</span>
        </div>
        {trainers.length > 0 && (
          <div className="mnb-trainers">
            <div className="mnb-trainers-k">{trainers.length === 1 ? 'Trainer' : `${trainers.length} Trainers`}</div>
            <div className="mnb-avs">
              {trainers.slice(0, 6).map((t) =>
                t.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={t.name} src={t.avatarUrl} alt={t.name} title={t.name} className="mnb-av" loading="lazy" />
                ) : (
                  <span key={t.name} className="mnb-av" title={t.name}>{initials(t.name)}</span>
                )
              )}
            </div>
            <div className="mnb-trainers-n">{trainers.map((t) => t.name).join(' · ')}</div>
          </div>
        )}
      </div>

      {/* Card 2 — Seats */}
      <div className="mnb-card rot-pos">
        <div className="mnb-tape" />
        <div className="mnb-pin" style={{ background: '#d64541' }} />
        <div className="mnb-label">{live ? 'Live Class Seats' : 'Seats Available'}</div>
        <h4>{seatsOpen <= 0 ? 'Fully Booked' : seatsOpen <= 5 ? `Only ${seatsOpen} Left!` : `${seatsOpen} Seats Open`}</h4>
        <div className="mnb-seats">
          {Array.from({ length: seatsTaken }).map((_, i) => <div key={`f-${i}`} className="mnb-seat" />)}
          {Array.from({ length: Math.max(0, seatsTotal - seatsTaken) }).map((_, i) => <div key={`o-${i}`} className="mnb-seat open" />)}
        </div>
        <div className="mnb-big">{seatsOpen}<span style={{ fontSize: 12, opacity: 0.5 }}> / {seatsTotal}</span></div>
        <div className="mnb-sub">{seatsTaken} registered · {seatsOpen} open</div>
        <span className="mnb-badge urgent" style={{ marginTop: 8, display: 'inline-flex' }}>{seatsBadge}</span>
      </div>

      {/* Card 3 — Quick Info */}
      <div className="mnb-card rot-flat">
        <div className="mnb-tape" />
        <div className="mnb-pin" style={{ background: '#3d6fb4' }} />
        <div className="mnb-label">At a Glance</div>
        <h4>Course Details</h4>
        <ul className="mnb-list">
          {live?.batchStart && !live.batchStarted ? (
            <>
              <li><span>Batch starts</span><span className="val">Tonight · 8:00 PM IST</span></li>
              <li><span>Next batch</span><span className="val">{nextBatchDisplay}</span></li>
            </>
          ) : (
            <li><span>{nextLabel}</span><span className="val">{nextBatchDisplay || nextValue}</span></li>
          )}
          {live?.scheduleLabel && <li><span>Schedule</span><span className="val">{live.scheduleLabel}</span></li>}
          {live?.classMinutes ? <li><span>Each class</span><span className="val">{live.classMinutes} min</span></li> : null}
          <li><span>Course fee</span><span className="val">{price}</span></li>
          <li><span>Duration</span><span className="val">{durationDisplay}</span></li>
          {homeTutors && (
            <li><span>Home Tutors</span><span className="val" style={{ color: '#35b0a0' }}>✓ NCR</span></li>
          )}
          <li><span>Certificate</span><span className="val">Yes</span></li>
        </ul>
      </div>

    </div>
  );
}
