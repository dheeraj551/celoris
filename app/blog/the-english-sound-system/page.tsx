'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EnglishSoundSystemBlog() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .blog-body-container {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'DM Sans', sans-serif;
          background-color: #FEFAF7 !important;
          color: #1A1A2E !important;
          line-height: 1.8;
          min-height: 100vh;
        }

        .blog-body-container * {
          box-sizing: border-box;
        }

        /* HERO */
        .blog-body-container .hero {
          background: linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%) !important;
          padding: 80px 24px 100px;
          position: relative;
          overflow: hidden;
        }
        .blog-body-container .hero::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%);
        }
        .blog-body-container .hero::after {
          content: '';
          position: absolute;
          bottom: -80px; left: 10%;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(233,69,96,0.1) 0%, transparent 70%);
        }
        .blog-body-container .hero-inner {
          max-width: 820px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }
        .blog-body-container .lesson-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,107,53,0.15);
          border: 1px solid rgba(255,107,53,0.3);
          color: #FF9E78 !important;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 100px;
          margin-bottom: 28px;
        }
        .blog-body-container .hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(36px, 6vw, 62px);
          font-weight: 900;
          color: #FFFFFF !important;
          line-height: 1.15;
          margin-bottom: 20px;
        }
        .blog-body-container .hero h1 span { color: #FF6B35 !important; }
        .blog-body-container .hero-sub {
          font-size: 18px;
          color: rgba(255,255,255,0.65) !important;
          max-width: 580px;
          line-height: 1.7;
          margin-bottom: 36px;
        }
        .blog-body-container .hero-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
        }
        .blog-body-container .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: rgba(255,255,255,0.5) !important;
        }
        .blog-body-container .meta-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #FF6B35 !important;
        }

        /* CONTENT */
        .blog-body-container .content-wrap {
          max-width: 820px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* PULL QUOTE */
        .blog-body-container .pull-quote {
          background: #1A1A2E !important;
          color: #fff !important;
          border-radius: 16px;
          padding: 36px 40px;
          margin: 56px 0;
          position: relative;
          overflow: hidden;
        }
        .blog-body-container .pull-quote::before {
          content: '"';
          font-family: 'Playfair Display', serif;
          font-size: 160px;
          color: rgba(255,107,53,0.12);
          position: absolute;
          top: -20px; left: 20px;
          line-height: 1;
        }
        .blog-body-container .pull-quote p {
          font-family: 'Playfair Display', serif;
          font-size: clamp(18px, 3vw, 24px);
          font-style: italic;
          line-height: 1.6;
          position: relative;
          z-index: 1;
          color: #fff !important;
          margin-bottom: 0px;
        }
        .blog-body-container .pull-quote span {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-style: normal;
          color: rgba(255,255,255,0.5) !important;
          margin-top: 14px;
        }

        /* SECTION */
        .blog-body-container .section { padding: 56px 0; border-bottom: 1px solid #F0E8E0; }
        .blog-body-container .section:last-child { border-bottom: none; }

        .blog-body-container .section-tag {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #FF6B35 !important;
          margin-bottom: 12px;
        }

        .blog-body-container h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 700;
          color: #1A1A2E !important;
          line-height: 1.3;
          margin-bottom: 20px;
        }

        .blog-body-container h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1A1A2E !important;
          margin: 32px 0 12px;
        }

        .blog-body-container p {
          font-size: 16px;
          color: #374151 !important;
          line-height: 1.85;
          margin-bottom: 18px;
        }

        /* PHONEME COUNTER */
        .blog-body-container .phoneme-counter {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin: 40px 0;
        }
        .blog-body-container .counter-card {
          background: #FFFFFF !important;
          border: 1px solid #F0E8E0;
          border-radius: 14px;
          padding: 24px 20px;
          text-align: center;
          transition: transform 0.2s;
        }
        .blog-body-container .counter-card:hover { transform: translateY(-3px); }
        .blog-body-container .counter-card .number {
          font-family: 'Playfair Display', serif;
          font-size: 52px;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 8px;
        }
        .blog-body-container .counter-card .label {
          font-size: 13px;
          color: #6B7280 !important;
          font-weight: 500;
        }
        .blog-body-container .counter-card.highlight {
          background: #1A1A2E !important;
          border-color: #1A1A2E;
          color: #fff !important;
        }
        .blog-body-container .counter-card.highlight .label { color: rgba(255,255,255,0.6) !important; }
        .blog-body-container .counter-card:nth-child(1) .number { color: #FF6B35 !important; }
        .blog-body-container .counter-card:nth-child(2) .number { color: #E94560 !important; }
        .blog-body-container .counter-card:nth-child(3) .number { color: #F5A623 !important; }

        /* VOWEL TABLE */
        .blog-body-container .vowel-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          margin: 40px 0;
        }
        .blog-body-container .vowel-card {
          border-radius: 14px;
          padding: 20px 12px;
          text-align: center;
          border: 1px solid transparent;
        }
        .blog-body-container .vowel-letter {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 6px;
        }
        .blog-body-container .vowel-name {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 14px;
          opacity: 0.7;
        }
        .blog-body-container .vowel-sounds {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .blog-body-container .sound-pill {
          font-size: 12px;
          font-weight: 500;
          padding: 5px 8px;
          border-radius: 8px;
        }
        .blog-body-container .v-a { background: #FFF3EE !important; border-color: #FFD5C2; }
        .blog-body-container .v-a .vowel-letter { color: #E05A1E !important; }
        .blog-body-container .v-a .vowel-name { color: #E05A1E !important; }
        .blog-body-container .v-a .sound-pill.short { background: #FFE8DC !important; color: #C04A10 !important; }
        .blog-body-container .v-a .sound-pill.long { background: #FFEEE6 !important; color: #E05A1E !important; }

        .blog-body-container .v-e { background: #EEF2FF !important; border-color: #C7D2FE; }
        .blog-body-container .v-e .vowel-letter { color: #4338CA !important; }
        .blog-body-container .v-e .vowel-name { color: #4338CA !important; }
        .blog-body-container .v-e .sound-pill.short { background: #E0E7FF !important; color: #3730A3 !important; }
        .blog-body-container .v-e .sound-pill.long { background: #EEF2FF !important; color: #4338CA !important; }

        .blog-body-container .v-i { background: #F0FDF4 !important; border-color: #BBF7D0; }
        .blog-body-container .v-i .vowel-letter { color: #15803D !important; }
        .blog-body-container .v-i .vowel-name { color: #15803D !important; }
        .blog-body-container .v-i .sound-pill.short { background: #DCFCE7 !important; color: #166534 !important; }
        .blog-body-container .v-i .sound-pill.long { background: #F0FDF4 !important; color: #15803D !important; }

        .blog-body-container .v-o { background: #FFF7ED !important; border-color: #FED7AA; }
        .blog-body-container .v-o .vowel-letter { color: #C2410C !important; }
        .blog-body-container .v-o .vowel-name { color: #C2410C !important; }
        .blog-body-container .v-o .sound-pill.short { background: #FFEDD5 !important; color: #9A3412 !important; }
        .blog-body-container .v-o .sound-pill.long { background: #FFF7ED !important; color: #C2410C !important; }

        .blog-body-container .v-u { background: #FDF4FF !important; border-color: #E9D5FF; }
        .blog-body-container .v-u .vowel-letter { color: #7E22CE !important; }
        .blog-body-container .v-u .vowel-name { color: #7E22CE !important; }
        .blog-body-container .v-u .sound-pill.short { background: #F3E8FF !important; color: #6B21A8 !important; }
        .blog-body-container .v-u .sound-pill.long { background: #FDF4FF !important; color: #7E22CE !important; }

        /* EXAMPLE WORDS */
        .blog-body-container .example-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin: 28px 0;
        }
        .blog-body-container .example-box {
          border-radius: 12px;
          padding: 20px 22px;
          border-left: 4px solid;
        }
        .blog-body-container .example-box.short {
          background: #FFF8F5 !important;
          border-color: #FF6B35 !important;
        }
        .blog-body-container .example-box.long {
          background: #F0F4FF !important;
          border-color: #6366F1 !important;
        }
        .blog-body-container .example-box .tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .blog-body-container .example-box.short .tag { color: #FF6B35 !important; }
        .blog-body-container .example-box.long .tag { color: #6366F1 !important; }
        .blog-body-container .example-box .words {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .blog-body-container .word-chip {
          font-size: 15px;
          font-weight: 500;
          padding: 4px 12px;
          border-radius: 100px;
        }
        .blog-body-container .example-box.short .word-chip { background: #FFE8DC !important; color: #9A3412 !important; }
        .blog-body-container .example-box.long .word-chip { background: #E0E7FF !important; color: #3730A3 !important; }

        /* RULE BOX */
        .blog-body-container .rule-box {
          background: linear-gradient(135deg, #1A1A2E, #0F3460) !important;
          border-radius: 16px;
          padding: 32px 36px;
          margin: 36px 0;
          color: #fff !important;
          position: relative;
          overflow: hidden;
        }
        .blog-body-container .rule-box::after {
          content: '';
          position: absolute;
          right: -30px; top: -30px;
          width: 150px; height: 150px;
          border-radius: 50%;
          background: rgba(255,107,53,0.1);
        }
        .blog-body-container .rule-box h3 {
          color: #FF6B35 !important;
          margin-top: 0;
          margin-bottom: 14px;
          font-size: 16px;
        }
        .blog-body-container .rule-box p, .blog-body-container .rule-box li {
          color: rgba(255,255,255,0.8) !important;
          font-size: 15px;
          line-height: 1.75;
        }
        .blog-body-container .rule-box ul {
          padding-left: 20px;
          margin: 0;
        }
        .blog-body-container .rule-box ul li { margin-bottom: 8px; }

        /* PRACTICE SECTION */
        .blog-body-container .practice-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin: 28px 0;
        }
        .blog-body-container .practice-card {
          background: #fff !important;
          border: 1px solid #F0E8E0;
          border-radius: 12px;
          padding: 20px;
        }
        .blog-body-container .practice-card h4 {
          font-size: 14px;
          font-weight: 600;
          color: #6B7280 !important;
          margin-bottom: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .blog-body-container .pair-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 10px;
          font-size: 15px;
        }
        .blog-body-container .pair-row .w1 {
          font-weight: 600;
          color: #C04A10;
          min-width: 60px;
        }
        .blog-body-container .pair-row .arrow {
          color: #9CA3AF !important;
          font-size: 12px;
        }
        .blog-body-container .pair-row .w2 {
          font-weight: 600;
          color: #3730A3 !important;
        }
        .blog-body-container .pair-row .hint {
          font-size: 12px;
          color: #9CA3AF !important;
          margin-left: auto;
        }

        /* TIP BOX */
        .blog-body-container .tip-box {
          background: #FFFBEB !important;
          border: 1px solid #FDE68A;
          border-radius: 12px;
          padding: 20px 24px;
          margin: 28px 0;
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        .blog-body-container .tip-icon {
          font-size: 20px;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .blog-body-container .tip-box p { color: #92400E !important; font-size: 15px; margin: 0; }
        .blog-body-container .tip-box strong { font-weight: 600; display: block; margin-bottom: 4px; }

        /* CELORIS PROMO */
        .blog-body-container .promo-banner {
          background: linear-gradient(135deg, #FF6B35, #E94560) !important;
          border-radius: 20px;
          padding: 44px 40px;
          margin: 56px 0;
          text-align: center;
          color: #fff !important;
        }
        .blog-body-container .promo-banner h2 {
          color: #fff !important;
          font-family: 'Playfair Display', serif;
          margin-bottom: 14px;
        }
        .blog-body-container .promo-banner p { color: rgba(255,255,255,0.85) !important; margin-bottom: 28px; }
        .blog-body-container .promo-btn {
          display: inline-block;
          background: #fff !important;
          color: #FF6B35 !important;
          font-weight: 700;
          font-size: 15px;
          padding: 14px 36px;
          border-radius: 100px;
          text-decoration: none;
          letter-spacing: 0.3px;
        }

        /* FOOTER */
        .blog-body-container .blog-footer {
          background: #1A1A2E !important;
          padding: 40px 24px;
          text-align: center;
          color: rgba(255,255,255,0.5) !important;
          font-size: 14px;
        }
        .blog-body-container .blog-footer strong { color: #FF6B35 !important; }

        /* BREADCRUMB */
        .blog-body-container .breadcrumb {
          background: #fff !important;
          border-bottom: 1px solid #F0E8E0;
          padding: 14px 24px;
        }
        .blog-body-container .breadcrumb-inner {
          max-width: 820px;
          margin: 0 auto;
          font-size: 13px;
          color: #6B7280 !important;
        }
        .blog-body-container .breadcrumb-inner a { color: #FF6B35 !important; text-decoration: none; }
        .blog-body-container .breadcrumb-inner a:hover { text-decoration: underline; }

        @media (max-width: 600px) {
          .blog-body-container .phoneme-counter { grid-template-columns: 1fr 1fr; }
          .blog-body-container .vowel-grid { grid-template-columns: repeat(3, 1fr); }
          .blog-body-container .example-row, .blog-body-container .practice-grid { grid-template-columns: 1fr; }
          .blog-body-container .pull-quote { padding: 28px 24px; }
          .blog-body-container .promo-banner { padding: 32px 24px; }
        }
      ` }} />
      
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <div className="blog-body-container">
        <div className="breadcrumb">
          <div className="breadcrumb-inner">
            <Link href="/blog" className="flex items-center gap-1 inline-flex">
              <ArrowLeft className="h-3 w-3" /> Back to Blog
            </Link> › <a href="#">Spoken English Course</a> › Lesson 1.1
          </div>
        </div>

        <div className="hero">
          <div className="hero-inner">
            <div className="lesson-badge">
              <span>●</span> Module 1 · Lesson 1.1
            </div>
            <h1>The English<br /><span>Sound System</span></h1>
            <p className="hero-sub">
              English has 44 sounds but only 26 letters — and that's exactly why so many learners get confused. Let's fix that, starting with the 5 vowels.
            </p>
            <div className="hero-meta">
              <div className="meta-item"><div className="meta-dot"></div> 8 min read</div>
              <div className="meta-item"><div className="meta-dot"></div> Beginner Friendly</div>
              <div className="meta-item"><div className="meta-dot"></div> Spoken English Series</div>
            </div>
          </div>
        </div>

        <div className="content-wrap">

          {/* INTRO SECTION */}
          <div className="section">
            <p style={{ fontSize: "18px", fontWeight: 300, color: "#374151", lineHeight: 1.9 }}>
              Here's a question that confuses almost every Hindi or regional language speaker learning English: <em>"Why doesn't 'cat' rhyme with 'cake' even though both start with the same letter A?"</em>
            </p>
            <p>
              The answer is simple — in English, one letter can make multiple different sounds. The letter A alone makes at least 5 different sounds in everyday speech. This is what makes English pronunciation so tricky, and why most people who "know" English still struggle to speak it clearly.
            </p>
            <p>
              In this lesson, we're going to understand the foundation of English pronunciation: the sound system. Once you understand how sounds work — not just letters — everything else starts to click.
            </p>

            <div className="phoneme-counter">
              <div className="counter-card">
                <div className="number">26</div>
                <div className="label">Letters in the alphabet</div>
              </div>
              <div className="counter-card">
                <div className="number">44</div>
                <div className="label">Total phonemes (sounds)</div>
              </div>
              <div className="counter-card highlight">
                <div className="number" style={{ color: "var(--celoris-primary)" }}>18</div>
                <div className="label">Extra sounds letters can't show</div>
              </div>
            </div>

            <p>
              The technical name for a single unit of sound is a <strong>phoneme</strong>. English has 44 phonemes — but only 26 letters to represent them. That gap of 18 is why English spelling and pronunciation often don't match up.
            </p>
          </div>

          {/* PULL QUOTE */}
          <div className="pull-quote">
            <p>
              You're not bad at English — you were just never taught to listen for sounds instead of letters.
            </p>
            <span>— The mindset shift that changes everything</span>
          </div>

          {/* VOWELS SECTION */}
          <div className="section">
            <div className="section-tag">Core Concept</div>
            <h2>Meet the 5 Vowels — And Their Double Lives</h2>

            <p>
              Every English word contains at least one vowel sound. The 5 vowel letters are A, E, I, O, and U — but each of these letters can produce two very different sounds depending on the word. We call these <strong>short vowel sounds</strong> and <strong>long vowel sounds</strong>.
            </p>
            <p>
              Here's the key insight: <strong>long vowel sounds say the letter's name</strong>. The long sound of A is "ay" (like saying the letter A). The long sound of E is "ee". Short sounds, on the other hand, are clipped and quick — they don't match the letter's name at all.
            </p>

            <div className="vowel-grid">
              <div className="vowel-card v-a">
                <div className="vowel-letter">A</div>
                <div className="vowel-name">Vowel A</div>
                <div className="vowel-sounds">
                  <div className="sound-pill short">Short: /æ/ — "cat"</div>
                  <div className="sound-pill long">Long: /eɪ/ — "cake"</div>
                </div>
              </div>
              <div className="vowel-card v-e">
                <div className="vowel-letter">E</div>
                <div className="vowel-name">Vowel E</div>
                <div className="vowel-sounds">
                  <div className="sound-pill short">Short: /ɛ/ — "bed"</div>
                  <div className="sound-pill long">Long: /iː/ — "heat"</div>
                </div>
              </div>
              <div className="vowel-card v-i">
                <div className="vowel-letter">I</div>
                <div className="vowel-name">Vowel I</div>
                <div className="vowel-sounds">
                  <div className="sound-pill short">Short: /ɪ/ — "bit"</div>
                  <div className="sound-pill long">Long: /aɪ/ — "bite"</div>
                </div>
              </div>
              <div className="vowel-card v-o">
                <div className="vowel-letter">O</div>
                <div className="vowel-name">Vowel O</div>
                <div className="vowel-sounds">
                  <div className="sound-pill short">Short: /ɒ/ — "hot"</div>
                  <div className="sound-pill long">Long: /oʊ/ — "hope"</div>
                </div>
              </div>
              <div className="vowel-card v-u">
                <div className="vowel-letter">U</div>
                <div className="vowel-name">Vowel U</div>
                <div className="vowel-sounds">
                  <div className="sound-pill short">Short: /ʌ/ — "cup"</div>
                  <div className="sound-pill long">Long: /juː/ — "cube"</div>
                </div>
              </div>
            </div>

            <p>
              Look at how dramatically the meaning changes with just a vowel sound shift. This is why pronunciation matters — it's not about accent, it's about being understood clearly.
            </p>
          </div>

          {/* SHORT vs LONG SECTION */}
          <div className="section">
            <div className="section-tag">Detailed Breakdown</div>
            <h2>Short vs Long — Word by Word</h2>

            <p>
              Let's go deeper into each vowel and build your vocabulary of sound pairs. The goal is to hear the difference, not just read it.
            </p>

            <h3>Vowel A: /æ/ vs /eɪ/</h3>
            <p>
              The short A (/æ/) is produced with your mouth open wide, jaw dropped. Your tongue stays low and flat. Think of how a doctor asks you to say "aaah." The long A (/eɪ/) closes slightly — it glides upward, almost as if your mouth is smiling at the end.
            </p>
            <div className="example-row">
              <div className="example-box short">
                <div className="tag">Short A — /æ/</div>
                <div className="words">
                  <span className="word-chip">cat</span>
                  <span className="word-chip">bag</span>
                  <span className="word-chip">hat</span>
                  <span className="word-chip">man</span>
                  <span className="word-chip">ran</span>
                  <span className="word-chip">land</span>
                </div>
              </div>
              <div className="example-box long">
                <div className="tag">Long A — /eɪ/</div>
                <div className="words">
                  <span className="word-chip">cake</span>
                  <span className="word-chip">name</span>
                  <span className="word-chip">late</span>
                  <span className="word-chip">rain</span>
                  <span className="word-chip">say</span>
                  <span className="word-chip">plane</span>
                </div>
              </div>
            </div>

            <h3>Vowel E: /ɛ/ vs /iː/</h3>
            <p>
              Short E (/ɛ/) is a relaxed, mid-mouth sound — lips barely spread. Long E (/iː/) is the opposite: your lips stretch into a wide smile, teeth close together. Native speakers sometimes exaggerate this stretch while greeting — "heeey!" That's the long E in action.
            </p>
            <div className="example-row">
              <div className="example-box short">
                <div className="tag">Short E — /ɛ/</div>
                <div className="words">
                  <span className="word-chip">bed</span>
                  <span className="word-chip">red</span>
                  <span className="word-chip">ten</span>
                  <span className="word-chip">pen</span>
                  <span className="word-chip">net</span>
                  <span className="word-chip">left</span>
                </div>
              </div>
              <div className="example-box long">
                <div className="tag">Long E — /iː/</div>
                <div className="words">
                  <span className="word-chip">heat</span>
                  <span className="word-chip">feet</span>
                  <span className="word-chip">team</span>
                  <span className="word-chip">green</span>
                  <span className="word-chip">speak</span>
                  <span className="word-chip">keep</span>
                </div>
              </div>
            </div>

            <h3>Vowel I: /ɪ/ vs /aɪ/</h3>
            <p>
              This pair trips up almost every Indian English speaker because in Hindi, the letter इ has just one sound. In English, the "I" letter behaves very differently depending on the word. Short I (/ɪ/) is a quick, unstressed sound — like the "i" in "it." Long I (/aɪ/) is a diphthong — your mouth starts open and glides closed, creating two sounds merged into one.
            </p>
            <div className="example-row">
              <div className="example-box short">
                <div className="tag">Short I — /ɪ/</div>
                <div className="words">
                  <span className="word-chip">bit</span>
                  <span className="word-chip">sit</span>
                  <span className="word-chip">hit</span>
                  <span className="word-chip">tip</span>
                  <span className="word-chip">win</span>
                  <span className="word-chip">fill</span>
                </div>
              </div>
              <div className="example-box long">
                <div className="tag">Long I — /aɪ/</div>
                <div className="words">
                  <span className="word-chip">bite</span>
                  <span className="word-chip">site</span>
                  <span className="word-chip">kite</span>
                  <span className="word-chip">time</span>
                  <span className="word-chip">wine</span>
                  <span className="word-chip">file</span>
                </div>
              </div>
            </div>

            <h3>Vowel O: /ɒ/ vs /oʊ/</h3>
            <p>
              Short O (/ɒ/) is a low, round, open sound — your lips form a small "o" shape and the sound comes from the back of the throat. Long O (/oʊ/) is again a diphthong — it glides from "oh" to "oo," with your lips rounding and pushing slightly forward as the sound ends.
            </p>
            <div className="example-row">
              <div className="example-box short">
                <div className="tag">Short O — /ɒ/</div>
                <div className="words">
                  <span className="word-chip">hot</span>
                  <span className="word-chip">got</span>
                  <span className="word-chip">top</span>
                  <span className="word-chip">dog</span>
                  <span className="word-chip">rock</span>
                  <span className="word-chip">stop</span>
                </div>
              </div>
              <div className="example-box long">
                <div className="tag">Long O — /oʊ/</div>
                <div className="words">
                  <span className="word-chip">hope</span>
                  <span className="word-chip">home</span>
                  <span className="word-chip">tone</span>
                  <span className="word-chip">grow</span>
                  <span className="word-chip">road</span>
                  <span className="word-chip">close</span>
                </div>
              </div>
            </div>

            <h3>Vowel U: /ʌ/ vs /juː/</h3>
            <p>
              Short U (/ʌ/) is one of the most common sounds in English — it appears in hundreds of everyday words and is often called the "schwa's twin." Your mouth is relaxed, jaw slightly open, no lip rounding. Long U (/juː/) sounds like the letter's own name — "you." Lips round forward, and the sound is longer and more deliberate.
            </p>
            <div className="example-row">
              <div className="example-box short">
                <div className="tag">Short U — /ʌ/</div>
                <div className="words">
                  <span className="word-chip">cup</span>
                  <span className="word-chip">run</span>
                  <span className="word-chip">mud</span>
                  <span className="word-chip">but</span>
                  <span className="word-chip">jump</span>
                  <span className="word-chip">sun</span>
                </div>
              </div>
              <div className="example-box long">
                <div className="tag">Long U — /juː/</div>
                <div className="words">
                  <span className="word-chip">cube</span>
                  <span className="word-chip">tune</span>
                  <span className="word-chip">mule</span>
                  <span className="word-chip">cute</span>
                  <span className="word-chip">fuse</span>
                  <span className="word-chip">use</span>
                </div>
              </div>
            </div>
          </div>

          {/* MAGIC E RULE */}
          <div className="section">
            <div className="section-tag">The Golden Rule</div>
            <h2>The Magic-E Rule: One Letter Changes Everything</h2>

            <p>
              Here's one of the most powerful and consistent rules in English pronunciation, and once you learn it, you'll immediately understand hundreds of words you've never seen before.
            </p>

            <div className="rule-box">
              <h3>The Magic-E Rule (also called Silent E)</h3>
              <p>
                When a word ends in a silent letter E, the vowel before the consonant changes from a short sound to a long sound — and the E itself is not pronounced at all.
              </p>
              <p style={{ marginTop: "12px", color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
                Pattern: consonant – vowel – consonant – E → the middle vowel becomes LONG
              </p>
            </div>

            <p>
              Watch what happens to the vowel when we add a silent E:
            </p>

            <div className="practice-grid">
              <div className="practice-card">
                <h4>Short → Long (A)</h4>
                <div className="pair-row"><span className="w1">cap</span><span className="arrow">→</span><span className="w2">cape</span><span className="hint">/æ/ → /eɪ/</span></div>
                <div className="pair-row"><span className="w1">mat</span><span className="arrow">→</span><span className="w2">mate</span><span className="hint">/æ/ → /eɪ/</span></div>
                <div className="pair-row"><span className="w1">pan</span><span className="arrow">→</span><span className="w2">pane</span><span className="hint">/æ/ → /eɪ/</span></div>
                <div className="pair-row"><span className="w1">tap</span><span className="arrow">→</span><span className="w2">tape</span><span className="hint">/æ/ → /eɪ/</span></div>
              </div>
              <div className="practice-card">
                <h4>Short → Long (I)</h4>
                <div className="pair-row"><span className="w1">bit</span><span className="arrow">→</span><span className="w2">bite</span><span className="hint">/ɪ/ → /aɪ/</span></div>
                <div className="pair-row"><span className="w1">kit</span><span className="arrow">→</span><span className="w2">kite</span><span className="hint">/ɪ/ → /aɪ/</span></div>
                <div className="pair-row"><span className="w1">rid</span><span className="arrow">→</span><span className="w2">ride</span><span className="hint">/ɪ/ → /aɪ/</span></div>
                <div className="pair-row"><span className="w1">pin</span><span className="arrow">→</span><span className="w2">pine</span><span className="hint">/ɪ/ → /aɪ/</span></div>
              </div>
              <div className="practice-card">
                <h4>Short → Long (O)</h4>
                <div className="pair-row"><span className="w1">hop</span><span className="arrow">→</span><span className="w2">hope</span><span className="hint">/ɒ/ → /oʊ/</span></div>
                <div className="pair-row"><span className="w1">not</span><span className="arrow">→</span><span className="w2">note</span><span className="hint">/ɒ/ → /oʊ/</span></div>
                <div className="pair-row"><span className="w1">rod</span><span className="arrow">→</span><span className="w2">rode</span><span className="hint">/ɒ/ → /oʊ/</span></div>
                <div className="pair-row"><span className="w1">ton</span><span className="arrow">→</span><span className="w2">tone</span><span className="hint">/ɒ/ → /oʊ/</span></div>
              </div>
              <div className="practice-card">
                <h4>Short → Long (U)</h4>
                <div className="pair-row"><span className="w1">cub</span><span className="arrow">→</span><span className="w2">cube</span><span className="hint">/ʌ/ → /juː/</span></div>
                <div className="pair-row"><span className="w1">tub</span><span className="arrow">→</span><span className="w2">tube</span><span className="hint">/ʌ/ → /juː/</span></div>
                <div className="pair-row"><span className="w1">cut</span><span className="arrow">→</span><span className="w2">cute</span><span className="hint">/ʌ/ → /juː/</span></div>
                <div className="pair-row"><span className="w1">us</span><span className="arrow">→</span><span className="w2">use</span><span className="hint">/ʌ/ → /juː/</span></div>
              </div>
            </div>

            <div className="tip-box">
              <div className="tip-icon">💡</div>
              <p><strong>Practice tip from our trainers</strong>Say each word pair aloud 3 times in a row before moving on. Your mouth needs to learn the muscle memory, not just your brain. Try: "bit — bite — bit — bite — bit — bite." Notice how your jaw and lips move differently?</p>
            </div>
          </div>

          {/* WHY IT MATTERS */}
          <div className="section">
            <div className="section-tag">Real World Impact</div>
            <h2>Why This Actually Matters in Daily Conversation</h2>

            <p>
              You might be thinking — "I can just figure out the pronunciation from context." And yes, sometimes that works. But vowel errors create real misunderstandings, and some are downright embarrassing.
            </p>
            <p>
              Consider these commonly confused pairs in Indian English:
            </p>

            <div className="rule-box" style={{ background: "#1A1A2E" }}>
              <h3 style={{ color: "#F5A623" }}>Words Indians commonly mispronounce due to vowel confusion</h3>
              <ul>
                <li><strong style={{ color: "#fff" }}>sheet / shit</strong> — The long E vs short I distinction matters enormously here. Say "sheet" with a clear long E: /ʃiːt/</li>
                <li><strong style={{ color: "#fff" }}>beach / bitch</strong> — Same issue. Long E: /biːtʃ/ vs short I: /bɪtʃ/. Native speakers notice this immediately.</li>
                <li><strong style={{ color: "#fff" }}>live (verb) / live (adjective)</strong> — "I live in Delhi" uses short I (/lɪv/). "It's a live concert" uses long I (/laɪv/). Same spelling, different sounds, different meanings.</li>
                <li><strong style={{ color: "#fff" }}>read (present) / read (past)</strong> — "I read every day" = /riːd/ (long E). "I read that book" = /rɛd/ (short E). Again — same spelling, opposite sounds.</li>
              </ul>
            </div>

            <p>
              These aren't edge cases. These are words you'll use every single day. Getting the vowel sounds right is not about sounding "foreign" — it's about being understood correctly and coming across as confident in professional settings.
            </p>
          </div>

          {/* PRACTICE EXERCISES */}
          <div className="section">
            <div className="section-tag">Practice Time</div>
            <h2>Your Practice Exercises for Lesson 1.1</h2>

            <p>
              Pronunciation only improves with practice — not just with reading. Do these exercises out loud, ideally in front of a mirror so you can watch your mouth position.
            </p>

            <h3>Exercise 1: Sound Identification</h3>
            <p>
              For each word below, identify whether the vowel sound is SHORT or LONG, then say it aloud. Answers at the bottom.
            </p>
            <div className="rule-box" style={{ background: "#F9FAFB", color: "#1A1A2E", border: "1px solid #F0E8E0" }}>
              <p style={{ color: "#1A1A2E", fontSize: "15px" }}>
                1. <strong>fate</strong> — short or long A? &nbsp;&nbsp;
                2. <strong>hit</strong> — short or long I? &nbsp;&nbsp;
                3. <strong>bone</strong> — short or long O? &nbsp;&nbsp;
                4. <strong>cut</strong> — short or long U? &nbsp;&nbsp;
                5. <strong>feet</strong> — short or long E?
              </p>
              <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "12px", marginBottom: 0 }}>
                Answers: 1. Long &nbsp;|&nbsp; 2. Short &nbsp;|&nbsp; 3. Long &nbsp;|&nbsp; 4. Short &nbsp;|&nbsp; 5. Long
              </p>
            </div>

            <h3>Exercise 2: Minimal Pair Drilling</h3>
            <p>
              Say each pair 5 times, alternating between the two words. Focus on the physical difference in your mouth position:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", margin: "20px 0" }}>
              <span style={{ background: "#fff", border: "1px solid var(--border)", padding: "8px 18px", borderRadius: "100px", fontWeight: 500, fontSize: "15px" }}>bit / beat</span>
              <span style={{ background: "#fff", border: "1px solid var(--border)", padding: "8px 18px", borderRadius: "100px", fontWeight: 500, fontSize: "15px" }}>cap / cape</span>
              <span style={{ background: "#fff", border: "1px solid var(--border)", padding: "8px 18px", borderRadius: "100px", fontWeight: 500, fontSize: "15px" }}>hop / hope</span>
              <span style={{ background: "#fff", border: "1px solid var(--border)", padding: "8px 18px", borderRadius: "100px", fontWeight: 500, fontSize: "15px" }}>cut / cute</span>
              <span style={{ background: "#fff", border: "1px solid var(--border)", padding: "8px 18px", borderRadius: "100px", fontWeight: 500, fontSize: "15px" }}>bed / bead</span>
              <span style={{ background: "#fff", border: "1px solid var(--border)", padding: "8px 18px", borderRadius: "100px", fontWeight: 500, fontSize: "15px" }}>pin / pine</span>
            </div>

            <h3>Exercise 3: Sentence Practice</h3>
            <p>
              Read each sentence aloud slowly. Identify all the vowel sounds before you begin:
            </p>
            <div style={{ background: "#FFF8F5", borderRadius: "12px", padding: "20px 24px", marginTop: "16px" }}>
              <p style={{ marginBottom: "12px", fontSize: "15px" }}><em>"The cat sat on the late train to the lake."</em></p>
              <p style={{ marginBottom: "12px", fontSize: "15px" }}><em>"The bit of rope bit into the stone as Pete cut the vine."</em></p>
              <p style={{ fontSize: "15px", marginBottom: 0 }}><em>"The sun set and the tune on the radio was cute and fun."</em></p>
            </div>
          </div>

          {/* KEY TAKEAWAYS */}
          <div className="section">
            <div className="section-tag">Summary</div>
            <h2>Key Takeaways from Lesson 1.1</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "28px" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "20px", background: "#fff", border: "1px solid #F0E8E0", borderRadius: "12px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#FF6B35", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "14px", flexShrink: 0 }}>1</div>
                <p style={{ margin: 0, fontSize: "15px" }}>English has <strong>44 phonemes (sounds)</strong> but only 26 letters — this gap is the root cause of pronunciation confusion.</p>
              </div>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "20px", background: "#fff", border: "1px solid #F0E8E0", borderRadius: "12px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#E94560", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "14px", flexShrink: 0 }}>2</div>
                <p style={{ margin: 0, fontSize: "15px" }}>The <strong>5 vowels (A, E, I, O, U)</strong> each have two primary sounds — short and long — that completely change the word's pronunciation and meaning.</p>
              </div>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "20px", background: "#fff", border: "1px solid #F0E8E0", borderRadius: "12px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#F5A623", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "14px", flexShrink: 0 }}>3</div>
                <p style={{ margin: 0, fontSize: "15px" }}><strong>Long vowels say the letter's name</strong> — the long sound of A is "ay", E is "ee", I is "eye", O is "oh", U is "you."</p>
              </div>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "20px", background: "#fff", border: "1px solid var(--border)", borderRadius: "12px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#6366F1", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "14px", flexShrink: 0 }}>4</div>
                <p style={{ margin: 0, fontSize: "15px" }}>The <strong>Magic-E rule</strong> (silent E at the end of a word) reliably converts a short vowel to a long vowel — memorise this pattern and you'll decode hundreds of new words automatically.</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="promo-banner">
            <h2>Ready to Take This Further?</h2>
            <p>
              Lesson 1.1 is just the beginning. Our full Spoken English course on Celoris covers consonants, word stress, sentence rhythm, and real conversation practice — taught by verified trainers across India.
            </p>
            <a className="promo-btn" href="https://celoris.in">Explore the Course on Celoris →</a>
          </div>

        </div>

        <div className="blog-footer">
          <p>Written for <strong>Celoris</strong> — India's Skill Learning Marketplace &nbsp;·&nbsp; celoris.in</p>
          <p style={{ marginTop: "8px" }}>Part of the <strong>Spoken English Series</strong> · Module 1: Foundations of Pronunciation</p>
        </div>
      </div>
    </>
  );
}
