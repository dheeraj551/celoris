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
// course's requirements, its weekly modules, the linked classroom's schedule
// and the launch offer in the database.
function shortFormFaqs({ batch, price, modules }: FaqContext): CourseFaq[] {
  const fee = Number(price) > 0 ? Number(price) : 0
  const weeks = modules && modules > 0 ? modules : 6
  const faqs: CourseFaq[] = [
    {
      question: "Do I need a professional camera or editing software?",
      answer:
        "No. You only need a smartphone with a working camera. Basic lighting, a mic and a tripod (roughly ₹500–₹2,000) help but are optional.",
    },
    {
      question: "How are the classes held?",
      answer:
        `Live online classes in the Celoris Classrooms, one module a week for ${weeks} weeks.` +
        (batch?.scheduleLabel ? ` This batch meets ${batch.scheduleLabel}` + (batch.classMinutes ? ` for ${batch.classMinutes} minutes.` : ".") : "") +
        (batch?.batchStart && !batch.batchStarted ? ` The first class is on ${istFullDate(batch.batchStart)} at ${istTime(batch.batchStart)} IST.` : "") +
        (batch?.trainers && batch.trainers.length > 1 ? ` The batch is taught by ${batch.trainers.length} trainers: ${batch.trainers.map((t) => t.name).join(", ")}.` : ""),
    },
    {
      question: "Is this course for complete beginners?",
      answer:
        "Yes. Week 1 starts with the foundations and mindset of short-form video, and the course builds up to growth analytics and monetization, so beginners and people who already post can both join.",
    },
    {
      question: "Will I learn how to earn money from Shorts and Reels?",
      answer:
        "Yes. The final week covers monetization: brand deals, affiliate marketing, YouTube Shorts ad revenue sharing through the YouTube Partner Program, and selling your own products or services. Earnings depend on your content and consistency, so no income is guaranteed.",
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
    answer: "Yes, a Celoris certificate of completion is provided at the end.",
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
