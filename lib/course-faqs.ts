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

function digitalMarketingFaqs({ batch, price }: FaqContext): CourseFaq[] {
  const fee = Number(price) > 0 ? Number(price) : 0
  const faqs: CourseFaq[] = [
    {
      question: "How are the live digital marketing classes conducted and what is the batch schedule?",
      answer:
        "Classes are conducted live and interactively in Celoris Classrooms." +
        (batch?.scheduleLabel ? ` This batch meets ${batch.scheduleLabel}` + (batch.classMinutes ? ` (${batch.classMinutes} minutes per session).` : ".") : " Sessions include live ad account walkthroughs, screen sharing, and real-time Q&A.") +
        (batch?.batchStart && !batch.batchStarted ? ` The upcoming live batch starts on ${istFullDate(batch.batchStart)} at ${istTime(batch.batchStart)} IST.` : "") +
        " You learn directly from active performance marketers running live campaigns.",
    },
    {
      question: "Do I need any prior marketing, coding, or math background?",
      answer:
        "No prior experience is required. The curriculum begins with marketing fundamentals and consumer psychology, then progresses step-by-step into hands-on tools like Meta Ads Manager, Google Ads, SEO, and GA4 analytics. A laptop or desktop is recommended for practicing on advertising dashboards.",
    },
    {
      question: "Will I get to run real ad campaigns on Meta and Google?",
      answer:
        "Yes! Unlike theoretical courses with static slides, you will set up real campaigns in Meta Ads Manager (Facebook & Instagram) and Google Ads. You will learn audience targeting, conversion tracking pixels, budgeting, A/B testing, and calculating ROAS (Return on Ad Spend) using live and simulated campaign scenarios.",
    },
    {
      question: "What modern AI marketing tools are covered in the curriculum?",
      answer:
        "You will learn 2026 AI-driven workflows: ChatGPT and Claude for crafting high-converting ad copy and email funnels, Canva and Celoris AI for creative ad graphics, and AI-assisted SEO keyword clustering tools to research and rank content faster.",
    },
    {
      question: "Is the course taught in Hindi, English, or Hinglish?",
      answer:
        "Sessions are delivered in clear bilingual Hinglish (Hindi + English) so complex concepts are easy to grasp for Indian students and professionals. All marketing terms, frameworks, and client deliverables are provided in professional English.",
    },
    {
      question: "Will this course help me start freelancing or land a digital marketing job in India?",
      answer:
        "Yes. You will complete real-world portfolio projects (Local Business Lead Generation, E-commerce ROAS Campaign, and a Technical SEO Audit). In India, entry-level digital marketers earn ₹3.5 LPA – ₹6 LPA, while freelancers typically charge ₹15,000 to ₹40,000/month per client retainer. We provide client pitch templates and freelancing contracts.",
    },
    {
      question: "What if I miss a live class? Are recordings provided?",
      answer:
        "Yes. High-definition recordings of every live session are uploaded immediately to your Celoris dashboard with lifetime access, alongside session notes, prompt swipe files, and direct coordinator support on WhatsApp.",
    },
  ]
  const offer = batch?.offer
  if (offer) {
    const seats = batch?.seatsTotal
    faqs.push({
      question: "How do the free passes work for this batch?",
      answer:
        `Free passes are released in rounds: up to ${offer.perRound} passes per round` +
        (seats ? `, until all ${seats} seats in the batch are filled` : "") +
        ". Once claimed, you get full access to the live batch, recordings, and projects at ₹0." +
        (fee > 0 ? ` The standard course fee is ${inr(fee)}.` : ""),
    })
  } else if (fee > 0) {
    faqs.push({
      question: "What is the fee for the Digital Marketing Mastery course?",
      answer: `The complete course fee is ${inr(fee)}, with no hidden software or examination charges.`,
    })
  }
  faqs.push({
    question: "Do I receive a verified certificate upon completion?",
    answer: "Yes, upon submitting the capstone portfolio project, you receive an official Celoris Academy Certificate of Completion that can be added to your LinkedIn profile and CV.",
  })
  return faqs
}

export function getFaqsForCourse(courseTitle: string, ctx: FaqContext = {}): CourseFaq[] {
  const title = courseTitle.toLowerCase();
  if (title.includes("short-form video") || (title.includes("shorts") && title.includes("reels"))) {
    return shortFormFaqs(ctx);
  }
  if (title.includes("digital marketing")) {
    return digitalMarketingFaqs(ctx);
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
