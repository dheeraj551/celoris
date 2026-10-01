// Course FAQs, shared by the course page (visible Q&A) and its layout
// (FAQPage structured data), so both always say exactly the same thing.

import { inr, istFullDate, istTime, type CourseBatchInfo } from "@/lib/course-batch-types"

export interface CourseFaq {
  question: string
  answer: string
}

export interface FaqContext {
  batch?: CourseBatchInfo | null
  price?: number | null
  modules?: number
  requirements?: string[] | null
}

// The Short-Form Video Masterclass — built only from facts on record: the
// course's requirements, its 10-hour curriculum modules, the linked classroom's schedule
// and the launch offer in the database.
function shortFormFaqs({ batch, price }: FaqContext): CourseFaq[] {
  const fee = Number(price) > 0 ? Number(price) : 0
  const faqs: CourseFaq[] = [
    {
      question: "How long is this course and how are the live classes conducted?",
      answer:
        "This is a focused 10-hour live online masterclass conducted in the Celoris Classrooms." +
        (batch?.scheduleLabel ? ` This batch meets ${batch.scheduleLabel}` + (batch.classMinutes ? ` for ${batch.classMinutes} minutes per session.` : ".") : "") +
        (batch?.batchStart && !batch.batchStarted ? ` The first live class starts on ${istFullDate(batch.batchStart)} at ${istTime(batch.batchStart)} IST.` : "") +
        (batch?.trainers && batch.trainers.length > 1 ? ` The batch is mentored by ${batch.trainers.length} creators: ${batch.trainers.map((t) => t.name).join(", ")}.` : " Every session includes live practical demonstrations and interactive Q&A."),
    },
    {
      question: "Do I need a professional camera or expensive editing software?",
      answer:
        "No. You only need any standard smartphone with a working camera. You will learn how to shoot high-retention videos with natural lighting and edit smoothly using free mobile apps like CapCut, VN, and InShot.",
    },
    {
      question: "Is this 10-hour masterclass suitable for complete beginners?",
      answer:
        "Yes, absolutely. The curriculum begins with creator mindset, niche selection, and camera confidence, and systematically progresses through 1.5-second hooks, mobile shooting, retention editing, algorithm growth, and monetization.",
    },
    {
      question: "What if I miss a live session? Are recordings provided?",
      answer:
        "Yes! Every enrolled student gets lifetime access to high-definition recordings of all 10 hours of live sessions, plus downloadable script templates, swipe files, and the ₹12,500 Exclusive Creator Bonus Pack.",
    },
    {
      question: "Will I learn how to earn money from YouTube Shorts and Instagram Reels?",
      answer:
        "Yes. Module 6 is dedicated to creator monetization: pitching Indian brands for paid sponsorships (with ready-to-use email/DM templates), rate cards in INR, affiliate marketing, YouTube Shorts ad revenue, and selling your own products or services.",
    },
  ]
  const offer = batch?.offer
  if (offer) {
    const seats = batch?.seatsTotal
    faqs.push({
      question: "How do the free passes work?",
      answer:
        `Free passes are released in rounds: up to ${offer.perRound} per round` +
        (seats ? `, until all ${seats} seats in the batch are taken` : "") +
        ". The first round closes when the first class starts; if seats are still left, a new round opens until the next class. Once the batch is full, you can join the waitlist for the next batch." +
        (fee > 0 ? ` The course is worth ${inr(fee)}.` : ""),
    })
  } else if (fee > 0) {
    faqs.push({
      question: "How much does the course cost?",
      answer: `The course fee is ${inr(fee)}.`,
    })
  }
  faqs.push({
    question: "Do I get a certificate?",
    answer: "Yes, an official Celoris certificate of completion is provided upon finishing the masterclass.",
  })
  return faqs
}

export function getFaqsForCourse(courseTitle: string, ctx: FaqContext = {}): CourseFaq[] {
  const title = courseTitle.toLowerCase();
  if (title.includes("short-form video") || (title.includes("shorts") && title.includes("reels"))) {
    return shortFormFaqs(ctx);
  }
  if (title.includes("digital marketing")) {
    return [
      {
        question: "Do I need any technical background?",
        answer: "No. This course is beginner-friendly and builds up progressively."
      },
      {
        question: "Will I get to run real ad campaigns during the course?",
        answer: "Yes — you'll get hands-on practice with real ad platforms (Meta, Google) using either simulated or live budgets depending on batch structure."
      },
      {
        question: "Is this course useful if I already run my own business?",
        answer: "Absolutely — many students join specifically to market their own business rather than pursue a marketing job."
      },
      {
        question: "What if I miss a live session?",
        answer: "Recordings are provided so you can catch up before the next class."
      },
      {
        question: "Is there a certificate?",
        answer: "Yes, a Celoris certificate of completion is provided at the end."
      }
    ];
  }
  if (title.includes("web development")) {
    return [
      {
        question: "I have zero coding background. Can I still join?",
        answer: "Yes — this course is designed for complete beginners and builds up step by step."
      },
      {
        question: "Will I actually build a real website, or just learn theory?",
        answer: "You'll build multiple real projects throughout the course, ending with a live, deployed capstone project."
      },
      {
        question: "Do I need to buy any software?",
        answer: "No — all tools used (VS Code, GitHub, hosting platforms) have free tiers sufficient for this course."
      },
      {
        question: "What if I miss a live session?",
        answer: "Recordings are provided so you can catch up before the next class."
      },
      {
        question: "Is this course enough to get a developer job?",
        answer: "This course gives you a strong practical foundation and portfolio. Landing a job also depends on practice and interview prep, which we guide you on, but outcomes vary per individual effort."
      },
      {
        question: "Is there a certificate?",
        answer: "Yes, a Celoris certificate of completion is provided at the end."
      }
    ];
  }
  if (title.includes("ai-powered web development")) {
    return [
      {
        question: "If AI builds the website, what am I actually learning?",
        answer: "You're learning to direct AI effectively, understand and customize what it generates, and combine tools professionally — this is exactly how working developers operate today. Pure prompting without understanding gets you stuck the moment something breaks; this course prevents that."
      },
      {
        question: "Do I still need to learn to code?",
        answer: "You'll learn enough HTML/CSS/JS to read, understand, and fix code — but you won't be writing everything from scratch the old way. That's the point: work smarter, ship faster."
      },
      {
        question: "I have zero coding background. Can I still join?",
        answer: "Yes — this course is designed for complete beginners and builds up step by step."
      },
      {
        question: "Will I build a real, live website?",
        answer: "Yes — multiple projects throughout the course, ending with a live, deployed capstone project."
      },
      {
        question: "What if I miss a live session?",
        answer: "Recordings are provided so you can catch up before the next class."
      },
      {
        question: "Is there a certificate?",
        answer: "Yes, a Celoris certificate of completion is provided at the end."
      }
    ];
  }
  if (title.includes("copilot")) {
    return [
      {
        question: "Do I need a Copilot license to take this course?",
        answer: "You need a Microsoft 365 Copilot license to follow along inside Excel itself, but every lesson is also taught with recordings and screenshots, so you can learn the concepts even before you have access."
      },
      {
        question: "I've never used Excel formulas before. Is this too advanced for me?",
        answer: "No — the course starts from the basics of structuring a spreadsheet and builds up gradually. Basic familiarity with cells and simple formulas is enough to start."
      },
      {
        question: "What's the difference between Plan mode and Agent Mode?",
        answer: "Plan mode outlines the steps for a single task and waits for your approval before making changes. Agent Mode goes further — it can plan and execute a multi-step workflow on its own, with checkpoints for you to review. Both are covered in depth in this course."
      },
      {
        question: "Will this teach me to blindly trust whatever Copilot generates?",
        answer: "The opposite — a full module is dedicated to verifying and trusting Copilot's output, including spot-checking formulas and being mindful of what data you share with it."
      },
      {
        question: "Is there a certificate?",
        answer: "Yes, a Celoris certificate of completion is provided at the end, along with a capstone project you can show as a work sample."
      }
    ];
  }
  return [];
}
