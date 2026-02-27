"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, HelpCircle, BookOpen, Zap, Lightbulb, Shield, Bot, Database, Mail, Brain, History, UserCheck, Layers, Share2, ShieldCheck, Fingerprint, Lock, Trash2, Sliders, MessageSquare, Trophy } from "lucide-react"
import { InteractiveQuiz } from "@/components/InteractiveQuiz"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function PersonalizedAICourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Personalized AI Experiences with RAG & Agents | Celoris Designs";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        const descriptionText = "Build AI that knows your users, remembers their history, and anticipates their needs. Master RAG, memory systems, and agentic workflows for hyper-personalization. Free to start. No credit card. celoris.in 🇮🇳";
        if (metaDescription) {
            metaDescription.setAttribute('content', descriptionText);
        } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = descriptionText;
            document.head.appendChild(meta);
        }
    }, []);

    const courseData = {
        title: "Personalized AI Experiences",
        subtitle: "with RAG & Agents",
        tagline: "Build AI that knows your users, remembers their history, and anticipates their needs.",
        description: "Escape the generic chatbot trap. This course teaches you how to build AI systems that provide truly 'magical' experiences by deeply understanding user context, maintaining long-term memory, and adapting dynamically to individual vibes and needs.",
        students: 850,
        rating: 4.95,
        duration: "6-Week Self-Paced",
        level: "Intermediate to Advanced",
        price: 19999,
        currency: "INR",
        provider: "Celoris Designs",
        website: "https://www.celorisdesigns.com",
        url: "https://www.celorisdesigns.com/courses/personalized-ai-experiences-with-rag-and-agents",
        learning_outcomes: [
            "Design sophisticated user profiles for explicit and implicit traits.",
            "Implement user-centric RAG with metadata filtering and re-ranking.",
            "Build robust memory systems using sliding windows and vector-based archival.",
            "Develop agents that plan and act based on user habits and constraints.",
            "Master tone and style transfer for dynamic output adaptation.",
            "Implement feedback loops for continuous AI improvement.",
            "Architect privacy-first systems with PII management and 'Right to be Forgotten'.",
            "Mitigate bias and prevent AI-driven echo chambers.",
            "Integrate LangGraph for stateful, multi-actor applications.",
            "Use Graph RAG (Neo4j) to map complex user-entity relationships."
        ],
        requirements: [
            "Proficiency in Python",
            "Familiarity with LLM APIs (OpenAI/Anthropic)",
            "Basic understanding of vector databases (Pinecone, Weaviate, etc.)",
            "Desire to build next-generation personalized AI products"
        ],
        chapters: [
            {
                number: 1,
                title: "The Personalization Paradigm",
                icon: "Brain",
                topics: [
                    "Why generic chatbots are failing and how context wins users.",
                    "The Hierarchy of Context: From zero-shot to few-shot to fully personalized state.",
                    "Defining the 'User Profile': Designing schema for user preferences, history, and explicit vs. implicit traits.",
                    "Architecture Patterns: Where personalization lives (Prompt vs. Context Window vs. Fine-tuning vs. RAG).",
                    "Case Study: Deconstructing Netflix or Spotify’s recommendation engines and mapping them to LLM architectures."
                ],
                videoUrl: "https://www.youtube.com/embed/knZTarz_df8",
                duration: "Week 1"
            },
            {
                number: 2,
                title: "User-Centric RAG",
                icon: "Database",
                topics: [
                    "Moving beyond semantic search to user-weighted retrieval.",
                    "Metadata Filtering Strategies: Injecting user IDs, role permissions, and temporal constraints into vector queries.",
                    "Recursive Retrieval & Re-ranking: Using user history to re-rank search results for relevance.",
                    "Graph RAG for Personalization: Using Knowledge Graphs (Neo4j) to map relationships between users and entities."
                ],
                duration: "Week 2"
            },
            {
                number: 3,
                title: "Memory Systems & State Management",
                icon: "History",
                topics: [
                    "Giving the AI a hippocampus: Short-term vs. Long-term Memory.",
                    "Entity Extraction for Memory: Automatically detecting and storing facts into structured SQL/NoSQL databases.",
                    "Summarization Strategies: Compressing conversation history into 'episodic memories' without losing nuance.",
                    "Lab: Building a persistent 'User Bio' that updates automatically after every conversation."
                ],
                duration: "Week 3"
            },
            {
                number: 4,
                title: "Agentic Planning & Sequential Tasks",
                icon: "Bot",
                topics: [
                    "Profile-Driven Planning: Modifying agent system prompts based on user sophistication.",
                    "Tool Selection Bias: Configuring agents to prefer specific tools based on user constraints.",
                    "Multi-Agent Hand-offs: Routing users to specific sub-agents based on tone analysis.",
                    "Using LangGraph for stateful, multi-actor applications."
                ],
                duration: "Week 4"
            },
            {
                number: 5,
                title: "Dynamic Adaptation & Style Transfer",
                icon: "Sliders",
                topics: [
                    "Tone & Style Matching: Analyzing user input to mirror syntax, complexity, and formality.",
                    "Format Personalization: Generating outputs in preferred formats (JSON, Markdown, Bullet points) automatically.",
                    "Feedback Loops: Implementing reinforcement mechanisms that update vector stores to avoid repeating mistakes.",
                    "Real-time adaptation without explicit user instructions."
                ],
                duration: "Week 5"
            },
            {
                number: 6,
                title: "Privacy, Security & Ethics",
                icon: "ShieldCheck",
                topics: [
                    "The risks of knowing too much: PII Management and anonymization techniques.",
                    "The 'Right to be Forgotten': Architecting systems for memory deletion and profile resets.",
                    "Bias & Echo Chambers: Preventing over-optimization and reinforcing harmful biases.",
                    "Ethics of persuasion in personalized AI."
                ],
                duration: "Week 6"
            }
        ],
        faqs: [
            {
                question: "What tech stack is recommended for this course?",
                answer: "We primarily use LangChain/LlamaIndex for orchestration, LangGraph for agents, Pinecone/Weaviate for vector storage, and Zep for memory. Experiments use GPT-4o and Claude 3.5 Sonnet."
            },
            {
                question: "Is this course suitable for beginners in AI?",
                answer: "This is an intermediate to advanced course. We recommend being comfortable with Python and basic LLM usage before enrolling."
            },
            {
                question: "Will I build a real project?",
                answer: "Yes, the capstone project is 'The Concierge', a Personal Travel & Lifestyle Assistant that incorporates all modules (Memory, RAG, Agents, and Personalization)."
            },
            {
                question: "How does personalization affect user retention?",
                answer: "Personalization creates high switching costs and 'magical' moments, which directly correlates to significantly lower churn rates in AI products."
            }
        ],
        projects: [
            {
                title: "The Concierge",
                description: "Build a Personal Travel & Lifestyle Assistant that remembers preferences and suggests tailored itineraries.",
                tools: "LangGraph + Pinecone + Zep",
                icon: "UserCheck"
            },
            {
                title: "Dynamic Style Mirror",
                description: "An AI agent that automatically adapts its communication style and format to match the user's vibe.",
                tools: "Claude 3.5 + Prompt Engineering",
                icon: "MessageSquare"
            },
            {
                title: "Safe Memory System",
                description: "A memory architecture that automatically scrubs PII and supports 'Right to be Forgotten' requests.",
                tools: "SQL + Anonymization APIs",
                icon: "Lock"
            }
        ],
        quiz_data: [
            {
                title: "Unit 1: Fundamentals of Agentic Memory",
                questions: [
                    {
                        question: "What is the core definition of 'Agentic Memory' (AgeMem)?",
                        options: ["A static retrieval-augmented generation (RAG) system.", "A unified framework that integrates long-term and short-term memory management directly into an agent's policy.", "A simple key-value cache for storing user preferences.", "A manual controller for external database queries."],
                        correctIndex: 1
                    },
                    {
                        question: "How does AgeMem expose memory operations to an LLM agent?",
                        options: ["Through internal model weights only.", "Via explicit tool-based actions such as store, retrieve, update, or discard.", "By using periodic human intervention.", "Through hardcoded heuristic schedules."],
                        correctIndex: 1
                    },
                    {
                        question: "In the context of agentic applications, what does 'Episodic Memory' capture?",
                        options: ["Abstracted user traits and general knowledge.", "Specific historical interactions and session-level events in chronological order.", "Instructions for recurring tasks and protocols.", "Pre-defined system prompts and rules."],
                        correctIndex: 1
                    },
                    {
                        question: "Which memory type is used to record instructions for recurring tasks, such as writing style feedback?",
                        options: ["Semantic memory.", "Procedural memory.", "Associative memory.", "Working memory."],
                        correctIndex: 1
                    },
                    {
                        question: "What is the 'Storage Limitation Principle' under GDPR Article 5(1)(e)?",
                        options: ["Data must be stored in at least three geographic locations.", "Personal data must be kept for no longer than is necessary for the purposes for which it is processed.", "All data must be deleted within 24 hours of collection.", "Companies must limit storage to 1 terabyte per user."],
                        correctIndex: 1
                    },
                    {
                        question: "The EU AI Act requires providers of High-Risk AI Systems (HRAS) to maintain technical documentation for how long?",
                        options: ["1 year.", "5 years.", "10 years after the system is placed on the market.", "Indefinitely."],
                        correctIndex: 2
                    },
                    {
                        question: "What is the primary difference between 'Pseudonymisation' and 'Anonymisation' regarding GDPR?",
                        options: ["Pseudonymisation allows for indefinite data retention.", "Anonymisation irreversibly strips identifiers, while pseudonymised data remains personal data subject to the Storage Limitation Principle.", "They are legally identical terms.", "Pseudonymisation is only required for high-risk systems."],
                        correctIndex: 1
                    },
                    {
                        question: "What does the 'Mirror Effect' hypothesis suggest about AI empathy?",
                        options: ["AI models have developed genuine emotional intelligence.", "Perceived AI empathy emerges from grammatical reflection rather than genuine understanding.", "Users prefer AI that acts as a physical mirror in video calls.", "Empathy is purely a result of rapid response times."],
                        correctIndex: 1
                    },
                    {
                        question: "According to research on human-like typing behaviours, which agent was most preferred by users?",
                        options: ["The baseline agent with near-instant responses.", "The agent simulating only hesitation.", "The agent combining both hesitation and self-editing behaviours.", "The agent that never made typographical errors."],
                        correctIndex: 2
                    },
                    {
                        question: "What are the two key mechanisms of 'Reflective Memory Management' (RMM)?",
                        options: ["Memory Addition and Memory Deletion.", "Prospective Reflection and Retrospective Reflection.", "Vector Search and Keyword Matching.", "Human Feedback and Automatic Summarisation."],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Unit 2: Memory Architectures & Processes",
                questions: [
                    {
                        question: "In RMM, what does 'Prospective Reflection' specifically involve?",
                        options: ["Updating the retriever weights via RL.", "Dynamically summarising interactions into topic-based memory representations for future retrieval.", "Checking for GDPR compliance before storage.", "Assigning binary rewards to cited evidence."],
                        correctIndex: 1
                    },
                    {
                        question: "What is the function of the 'Reranker' in the RMM framework?",
                        options: ["It deletes obsolete memories from the bank.", "It refines initial retrieval results to prioritize the most pertinent memories for response generation.", "It summarizes the user's input query.", "It identifies the user's geographic location."],
                        correctIndex: 1
                    },
                    {
                        question: "Which training strategy is used in AgeMem to address sparse rewards?",
                        options: ["Proximal Policy Optimisation (PPO).", "Step-wise Group Relative Policy Optimisation (GRPO).", "Supervised Fine-Tuning (SFT) only.", "Standard Q-learning."],
                        correctIndex: 1
                    },
                    {
                        question: "In the three-stage RL strategy of AgeMem, what is the goal of Stage 2?",
                        options: ["Long-term memory construction.", "Learning proactive short-term memory control under distracting or irrelevant content.", "Final integrated task execution.", "Human-in-the-loop validation."],
                        correctIndex: 1
                    },
                    {
                        question: "How does AgeMem's 'FILTER' tool manage short-term memory?",
                        options: ["By adding new facts to the long-term store.", "By proactively identifying and removing redundant or irrelevant segments from the active context.", "By translating the context into multiple languages.", "By increasing the token budget for the session."],
                        correctIndex: 1
                    },
                    {
                        question: "What is the benefit of integrating 'MongoDB Store' with LangGraph?",
                        options: ["It replaces the need for an LLM generator.", "It enables cross-thread persistence, allowing agents to remember interactions across disparate sessions.", "It automatically encrypts all user conversations.", "It decreases the physical size of the context window."],
                        correctIndex: 1
                    },
                    {
                        question: "What does LangGraph's 'workflow state' act as?",
                        options: ["A permanent user profile.", "A shared container that stores intermediate data throughout an agent’s execution.", "A legal log for GDPR audits.", "A reward function for reinforcement learning."],
                        correctIndex: 1
                    },
                    {
                        question: "Which AWS service allows developers to manage agent memory via built-in strategies like 'User Preference' or 'Semantic'?",
                        options: ["AWS Bedrock.", "AgentCore Memory.", "AWS Lambda Memory.", "Amazon S3 Memory."],
                        correctIndex: 0
                    },
                    {
                        question: "Which difference was found between lexical and syntactic mirroring in AI responses?",
                        options: ["They were both around 50%.", "Lexical mirroring was 14 times higher than syntactic.", "Syntactic alignment was very high (approx. 67%), while lexical overlap was remarkably low (approx. 5%).", "Neither was present in the data."],
                        correctIndex: 2
                    },
                    {
                        question: "Why is the 'Invisible Mirror' concept important in AI ethics?",
                        options: ["It prevents users from seeing the AI's source code.", "Users attribute structural familiarity to AI understanding rather than recognizing their own patterns reflected back.", "It makes the UI more aesthetically pleasing.", "It is a required security feature under the EU AI Act."],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Unit 3: Implementation & Memory Types",
                questions: [
                    {
                        question: "Under RMM's 'Retrospective Reflection,' how are rewards assigned to memory entries?",
                        options: ["Based on manual user ratings.", "Based on whether the LLM cited the memory entry in its generated response.", "According to the age of the memory.", "Randomly to encourage exploration."],
                        correctIndex: 1
                    },
                    {
                        question: "What is the primary constraint on personal data retention when the GDPR and EU AI Act overlap?",
                        options: ["The AI Act documentation rule (10 years).", "The GDPR's Storage Limitation Principle (deletion when purpose ends).", "The developer's internal policy.", "No specific constraint exists."],
                        correctIndex: 1
                    },
                    {
                        question: "What is 'Semantic Memory' in the context of long-term agent systems?",
                        options: ["A record of specific past conversations.", "The storage of abstracted facts, user traits, and stable preferences.", "A log of every keyboard stroke by the user.", "Instructions for how the model should calculate rewards."],
                        correctIndex: 1
                    },
                    {
                        question: "Which framework treats memory as a 'temporal knowledge graph' to track how facts change over time?",
                        options: ["Letta.", "Mem0.", "Zep.", "Supermemory."],
                        correctIndex: 1
                    },
                    {
                        question: "What phenomenon is described by the 'Lost in the Middle' white paper?",
                        options: ["Models forgetting everything after 100 tokens.", "A U-shaped performance curve where models do best with information at the beginning and end of long contexts.", "Models randomly deleting memories in the middle of a session.", "Users losing interest in AI during long sessions."],
                        correctIndex: 1
                    },
                    {
                        question: "What is 'Right to be Forgotten' in GDPR-compliant AI memory?",
                        options: ["The AI's ability to forget users who don't pay.", "The individual's right to demand the erasure of their personal data from systems.", "A protocol for clearing a computer's RAM.", "The automatic deletion of all AI weights every month."],
                        correctIndex: 1
                    },
                    {
                        question: "What does the 'UPDATE' tool do in AgeMem?",
                        options: ["It updates the model to a newer version.", "It modifies existing long-term memory entries when new information supersedes previous knowledge.", "It increases the typing speed of the bot.", "It sends a notification to the user."],
                        correctIndex: 1
                    },
                    {
                        question: "What is the main goal of the 'Barton AI' tool at Barton Peveril College?",
                        options: ["To replace human teachers.", "To assist students with revision, research, and subject exploration in a safe environment.", "To monitor student lunch habits.", "To sell advertisements to local businesses."],
                        correctIndex: 1
                    },
                    {
                        question: "What does 'Verbal Mirroring' in AI interaction involve?",
                        options: ["Repeating every word the user says.", "Adjusting the AI's vocabulary, sentence structure, and style to match the user's patterns.", "Translating text into spoken audio.", "Using a high-pitched voice for all interactions."],
                        correctIndex: 1
                    },
                    {
                        question: "Which memory architecture specifically supports 'multi-hop' queries across entity relationships?",
                        options: ["Standard Vector Database.", "Graph-based memory (e.g., GraphRAG or Zep).", "Key-value store.", "Flat text file."],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Unit 4: Advanced Training & Operational Mechanics",
                questions: [
                    {
                        question: "In AgeMem, what is the purpose of resetting the short-term context between Stage 1 and Stage 2 of training?",
                        options: ["To save memory on the training server.", "To prevent information leakage and force the agent to retrieve information from long-term memory.", "To simulate a system crash.", "To delete the user's personal identity."],
                        correctIndex: 1
                    },
                    {
                        question: "What penalty can be applied for GDPR non-compliance?",
                        options: ["Up to €1 million.", "Up to 4% of global annual turnover or €20 million (whichever is higher).", "100 hours of community service for developers.", "Automatic blocking of the company's website."],
                        correctIndex: 1
                    },
                    {
                        question: "What is 'Associative Memory' used for in AI agents?",
                        options: ["Storing recurring task instructions.", "Identifying patterns and making inferences by navigating connections between entities.", "Capturing chronological session history.", "Storing hardcoded facts about the world."],
                        correctIndex: 1
                    },
                    {
                        question: "What characterizes 'DigitalEgo' in MICHAEL A BUMPUS’s framework?",
                        options: ["A system designed for multi-perspective debate.", "A singular, user-aligned agent designed to reflect and extend a specific user’s core values and reasoning.", "A bot that automatically posts to social media.", "A cloud-based backup system for personal photos."],
                        correctIndex: 1
                    },
                    {
                        question: "The 'AI Cabinet Method' is designed for what specific task?",
                        options: ["Storing documents in a digital cabinet.", "Simulating deliberative, multi-perspective debate through ensembles of purpose-built personas.", "Deleting user history according to GDPR.", "Generating images based on text prompts."],
                        correctIndex: 1
                    },
                    {
                        question: "Which of the following is a component of the AgeMem context management reward (R_context)?",
                        options: ["Token count only.", "Compression efficiency, preventive actions, and information preservation.", "Number of tools installed.", "User satisfaction rating."],
                        correctIndex: 1
                    },
                    {
                        question: "What is 'Gumbel Trick' in the RMM reranker design?",
                        options: ["A method for compressing text.", "A technique for stochastic sampling from a discrete distribution while preserving gradients.", "A legal loophole in the EU AI Act.", "A way to mirror user spelling mistakes."],
                        correctIndex: 1
                    },
                    {
                        question: "'Barton Buddy' is unique because it...",
                        options: ["Has full access to the public internet.", "Searches within preset, college-selected data sources and does not have public internet access.", "Replaces human tutors for exam marking.", "Is available only for staff members."],
                        correctIndex: 1
                    },
                    {
                        question: "Under RMM, what happens if an extracted memory discussions a previously discussed topic?",
                        options: ["It is automatically deleted to save space.", "It is merged with the existing memory into an updated one.", "The system asks the user for permission to store it.", "It creates a duplicate entry."],
                        correctIndex: 1
                    },
                    {
                        question: "'Supermemory' is primarily focused on which use case?",
                        options: ["Production AI agent infrastructure for enterprises.", "Individual user personal knowledge management and consumer personal assistant scenarios.", "High-speed financial trading.", "Legal document archiving for the EU."],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Unit 5: Regulation & Specialized Agents",
                questions: [
                    {
                        question: "What is the 'Purpose Limitation Principle' in GDPR?",
                        options: ["AI must have a limited number of goals.", "Personal data must be collected for specific, explicit, and legitimate purposes and not repurposed incompatibly.", "Models must stop training after achieving a specific accuracy.", "Users are limited in how many queries they can send."],
                        correctIndex: 1
                    },
                    {
                        question: "In AgeMem's LTM management, what is the goal of the 'Maintenance' reward?",
                        options: ["To reward the agent for staying online.", "To incentivize meaningful update or delete operations that improve memory quality over time.", "To encourage the agent to talk more frequently.", "To track physical hardware maintenance."],
                        correctIndex: 1
                    },
                    {
                        question: "What characterizes 'Episodic Memory' implementation?",
                        options: ["Pre-defined system prompts.", "Vectorised interaction tables and rolling buffers.", "Key-value summarized profiles.", "Hardcoded knowledge graphs."],
                        correctIndex: 1
                    },
                    {
                        question: "Which theory helps equip AI with the ability to respond to human emotional states effectively in the triad?",
                        options: ["Einstein’s Relativity.", "Regulatory Focus Theory, Mirroring Theory, and Emotional Contagion Theory.", "Quantum Entanglement.", "Newtonian Physics."],
                        correctIndex: 1
                    },
                    {
                        question: "What is the 'Right to Explanation' under GDPR?",
                        options: ["The AI must explain why it exists.", "Individuals are entitled to understand the reasoning behind decisions made via automated processing.", "Developers must explain their source code to the public.", "The government must explain AI laws every year."],
                        correctIndex: 1
                    },
                    {
                        question: "How does 'Letta' differ from a standalone memory layer?",
                        options: ["It is only used for image generation.", "It provides a complete agent runtime where agents directly edit their own memory blocks.", "It does not require any hardware to run.", "It is only compatible with Python 2."],
                        correctIndex: 1
                    },
                    {
                        question: "What is 'Sub-Linear Search' in advanced agentic memory?",
                        options: ["Searching for words in reverse alphabetical order.", "Scaling memory retrieval to millions of facts without linear increases in search time.", "A method that only searches the first 10 memories.", "Manual searching by a human operator."],
                        correctIndex: 1
                    },
                    {
                        question: "In the BARTON PEVERIL FAQs, how long do pre-checks for banned topics add to each request?",
                        options: ["1 second.", "About 3.5 seconds.", "1 minute.", "There is no delay."],
                        correctIndex: 1
                    },
                    {
                        question: "'Mirror Effect' findings suggest that developers should prioritize what to create connection?",
                        options: ["Perfect factual accuracy only.", "Syntactic alignment while maintaining lexical diversity.", "Rapid-fire, near-instant responses.", "Using as many technical terms as possible."],
                        correctIndex: 1
                    },
                    {
                        question: "What is 'REINFORCE' used for in RMM?",
                        options: ["To delete old data.", "To fine-tune the reranker weights based on citation-based rewards.", "To encrypt the database.", "To summarize long documents."],
                        correctIndex: 1
                    }
                ]
            }
        ],
        reviews: [
            {
                name: "Aman Khurana",
                role: "AI Product Engineer",
                rating: 5,
                comment: "This course completely changed how I think about AI products. Moving from generic responses to user-aware systems with memory felt like unlocking a new level of product design."
            },
            {
                name: "Isha Malhotra",
                role: "Conversational AI Designer",
                rating: 5,
                comment: "The sections on tone, vibe matching, and style transfer were outstanding. My chatbot now adapts naturally to users instead of sounding robotic or repetitive."
            },
            {
                name: "Rahul Nair",
                role: "Machine Learning Engineer",
                rating: 4,
                comment: "User-centric RAG with metadata filtering and re-ranking was explained extremely well. I’m now able to deliver highly relevant responses without overloading the context window."
            },
            {
                name: "Neelam Joshi",
                role: "AI Startup Founder",
                rating: 5,
                comment: "The personalization-to-retention connection is real. After applying what I learned, our churn dropped noticeably. This course pays for itself if you’re building a product."
            },
            {
                name: "Varun Sethi",
                role: "Full-Stack AI Developer",
                rating: 5,
                comment: "The memory systems module was gold. Sliding windows + vector archives finally made long-term memory practical instead of fragile or creepy."
            },
            {
                name: "Kavya Iyer",
                role: "UX Researcher – AI Systems",
                rating: 4,
                comment: "I appreciated the strong focus on ethics and privacy. The ‘Right to be Forgotten’ and PII-scrubbing architecture felt mature and enterprise-ready."
            },
            {
                name: "Siddharth Bansal",
                role: "Agentic Systems Engineer",
                rating: 5,
                comment: "LangGraph and multi-agent orchestration were explained clearly with real use cases. I can now design agents that plan, act, and adapt instead of just responding."
            },
            {
                name: "Pooja Kulkarni",
                role: "AI Solutions Architect",
                rating: 5,
                comment: "Graph RAG with Neo4j was a standout. Mapping user-entity relationships added depth and continuity to interactions I didn’t think was possible before."
            },
            {
                name: "Rohan Mehta",
                role: "Indie AI Builder",
                rating: 4,
                comment: "The capstone project ‘The Concierge’ is incredibly practical. By the end, I had a working assistant that actually remembers users and feels personal."
            },
            {
                name: "Ankit Verma",
                role: "Head of AI, SaaS Platform",
                rating: 5,
                comment: "This course strikes the perfect balance between engineering depth and product empathy. If you want to build AI that users genuinely love, this is the roadmap."
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Personalized AI Experiences with RAG & Agents",
        "description": "Master the art of building AI that deeply understands and adapts to individual users using RAG, Memory, and Agents.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs",
            "sameAs": "https://www.celorisdesigns.com"
        },
        "educationalLevel": "Intermediate to Advanced",
        "teaches": [
            "User Profiling for AI",
            "User-Centric RAG",
            "Long-term AI Memory",
            "Agentic Personalization",
            "Dynamic Style Transfer",
            "AI Privacy & Ethics"
        ]
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-8 selection:bg-purple-500/30">
            {/* JSON-LD Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
                    <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-purple-400 transition-colors">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-purple-400 transition-colors">Courses</Link>
                    <span>/</span>
                    <span className="text-slate-100 line-clamp-1">{courseData.title}</span>
                </div>

                {/* Back Button */}
                <Link href="/learn/courses" className="inline-flex items-center text-slate-400 hover:text-purple-400 mb-6 transition-all group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Course Header */}
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Advanced AI</span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">RAG & Agents</span>
                                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Celoris Designs</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                                {courseData.title} <span className="text-purple-500">{courseData.subtitle}</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-purple-400/90 font-medium">
                                {courseData.tagline}
                            </p>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
                                {courseData.description}
                            </p>
                        </div>

                        {/* Course Preview Image - Replaced with YouTube Video */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Card className="relative overflow-hidden border-0 bg-slate-900/50 backdrop-blur-xl rounded-2xl">
                                <div className="aspect-video relative overflow-hidden">
                                    <iframe
                                        className="w-full h-full"
                                        src="https://www.youtube.com/embed/ZwqAdQsXy3A?autoplay=0"
                                        title="Personalized AI Experiences with RAG & Agents"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </Card>
                        </div>

                        {/* Market Hook */}
                        <div className="p-8 rounded-3xl bg-purple-500/5 border border-purple-500/10">
                            <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                                <Zap className="h-5 w-5" />
                                Escape the Generic
                            </h3>
                            <p className="text-slate-300 leading-relaxed">
                                Most AI wrappers perform exactly the same for every user. Learn how to create sticky products that feel "magical" because they truly know the user. Personalization directly correlates to lower churn and higher user satisfaction.
                            </p>
                        </div>

                        {/* Learning Outcomes */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-purple-400" />
                                </div>
                                What You Will Master
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courseData.learning_outcomes.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-purple-500/30 transition-colors group">
                                        <div className="h-5 w-5 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-purple-500/20 transition-colors">
                                            <CheckCircle className="h-3 w-3 text-purple-400" />
                                        </div>
                                        <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Course Curriculum */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Layers className="h-6 w-6 text-blue-400" />
                                </div>
                                Curriculum Syllabus
                            </h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {courseData.chapters.map((chapter, index) => {
                                    const Icon = chapter.icon === "Brain" ? Brain :
                                        chapter.icon === "Database" ? Database :
                                            chapter.icon === "History" ? History :
                                                chapter.icon === "Bot" ? Bot :
                                                    chapter.icon === "Sliders" ? Sliders : ShieldCheck;
                                    return (
                                        <AccordionItem key={index} value={`chapter-${index}`} className="border border-slate-700/50 bg-slate-900/40 rounded-xl px-2 overflow-hidden">
                                            <AccordionTrigger className="hover:no-underline py-6">
                                                <div className="flex items-center gap-4 text-left w-full">
                                                    <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 shadow-inner">
                                                        <Icon className="h-6 w-6 text-purple-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-1">Module {chapter.number}</div>
                                                        <div className="text-lg font-semibold text-white">{chapter.title}</div>
                                                    </div>
                                                    <div className="hidden sm:flex items-center gap-2 text-slate-400 text-sm mr-4 bg-slate-800/50 px-3 py-1 rounded-full text-nowrap">
                                                        <Clock className="h-4 w-4" />
                                                        {chapter.duration}
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-6 px-4">
                                                <div className="pl-14 space-y-4">
                                                    <div className="h-px bg-gradient-to-r from-purple-500/30 to-transparent mb-4"></div>
                                                    <ul className="grid grid-cols-1 gap-3">
                                                        {chapter.topics.map((topic, topicIndex) => (
                                                            <li key={topicIndex} className="flex items-start gap-3 text-slate-400 group">
                                                                <div className="h-1.5 w-1.5 rounded-full bg-purple-500/40 mt-2 group-hover:bg-purple-500 transition-colors" />
                                                                <span className="text-sm leading-relaxed">{topic}</span>
                                                            </li>
                                                        ))}
                                                    </ul>

                                                    {(chapter as any).videoUrl && (
                                                        <div className="mt-6 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-2xl">
                                                            <div className="aspect-video">
                                                                <iframe
                                                                    className="w-full h-full"
                                                                    src={(chapter as any).videoUrl}
                                                                    title={`${chapter.title} - Video Lesson`}
                                                                    frameBorder="0"
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                                    allowFullScreen
                                                                ></iframe>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    );
                                })}
                            </Accordion>
                        </section>

                        {/* Projects Section */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/20 rounded-lg">
                                    <Award className="h-6 w-6 text-indigo-400" />
                                </div>
                                Hands-On Capstone Project
                            </h2>
                            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 mb-8">
                                <h3 className="text-xl font-bold text-white mb-2">Project: "The Concierge"</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Build a Personal Travel & Lifestyle Assistant that demonstrates onboarding, stateful memory across sessions, user-weighted RAG, and multi-agent tool usage in a variety of communication tones.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {courseData.projects.map((item, index) => {
                                    const Icon = item.icon === "UserCheck" ? UserCheck : item.icon === "MessageSquare" ? MessageSquare : Lock;
                                    return (
                                        <Card key={index} className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 hover:border-purple-500/40 transition-all duration-300 group">
                                            <CardContent className="pt-8 text-center h-full flex flex-col">
                                                <div className="mx-auto bg-slate-700/50 p-4 w-fit rounded-2xl border border-slate-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                                    <Icon className="h-8 w-8 text-purple-400" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                                <p className="text-sm text-slate-400 mb-4 flex-grow">{item.description}</p>
                                                <div className="text-xs font-mono bg-slate-950/50 p-2 rounded border border-slate-700 text-purple-500">
                                                    {item.tools}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </section>

                        {/* FAQ Section */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <HelpCircle className="h-6 w-6 text-purple-400" />
                                </div>
                                Frequently Asked Questions
                            </h2>
                            <Accordion type="single" collapsible className="w-full space-y-2">
                                {courseData.faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`faq-${index}`} className="border-slate-800">
                                        <AccordionTrigger className="text-slate-200 hover:text-white transition-colors text-left">{faq.question}</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 leading-relaxed">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </section>

                        {/* Student Reviews Section */}
                        <section className="space-y-6 pt-12 border-t border-slate-800/50">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <MessageSquare className="h-6 w-6 text-purple-400" />
                                </div>
                                Student Reviews
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {courseData.reviews.map((review, index) => (
                                    <div key={index} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-purple-500/30 transition-all group">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h4 className="font-bold text-white">{review.name}</h4>
                                                <p className="text-xs text-slate-400">{review.role}</p>
                                            </div>
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-3 w-3 ${i < review.rating ? "fill-purple-400 text-purple-400" : "text-slate-600"}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed italic">"{review.comment}"</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Interactive Quiz Section */}
                        <section id="quiz" className="pt-12 border-t border-slate-800/50">
                            <div className="mb-8 rotate-0">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/20 rounded-lg">
                                        <Trophy className="h-6 w-6 text-purple-400" />
                                    </div>
                                    Mastery Assessment: AI Memory & Paradigms
                                </h2>
                                <p className="text-slate-400 mt-2 italic">Validate your expertise in agentic memory architectures, empathetic interaction, and global AI regulations.</p>
                            </div>
                            <InteractiveQuiz
                                quizTitle="Personalized AI Mastery"
                                quizDescription="50 comprehensive questions covering AgeMem, RMM, GDPR compliance, and the future of agentic personalization."
                                quizUnits={courseData.quiz_data}
                                onCompleteMessage={(score, total) => {
                                    if (score >= 45) return "Exceptional Achievement! You are a 'Personalization Architect'. Your mastery of memory systems and regulatory frameworks is world-class.";
                                    if (score >= 35) return "Great Job! You have a strong grasp of agentic memory. Review the modules on GDPR and RMM to fill any remaining knowledge gaps.";
                                    return "Good Effort! We recommend re-visiting the modules on Episodic vs. Semantic memory and AI ethics before retaking the assessment.";
                                }}
                            />
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-8">
                            {/* Enrollment Card */}
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                <Card className="relative bg-slate-900 border-0 rounded-3xl overflow-hidden shadow-2xl">
                                    <CardContent className="p-8">
                                        <div className="text-center mb-8">
                                            
                                            <div className="text-purple-400 font-bold tracking-widest uppercase text-xs">Self-Paced Mastery</div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <CourseInquiryDialog
                                                courseTitle={courseData.title}
                                                buttonClassName="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-400 hover:to-blue-500 text-white rounded-2xl shadow-lg shadow-purple-500/25 transition-all active:scale-95"
                                            />
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-slate-800">
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Award className="h-5 w-5 text-purple-400" />
                                                <span>AI Personalization Certificate</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Zap className="h-5 w-5 text-yellow-400" />
                                                <span>6 Deep-Dive Modules</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Bot className="h-5 w-5 text-blue-400" />
                                                <span>LangGraph Mastery</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Users className="h-5 w-5 text-indigo-400" />
                                                <span>Lifetime Community Access</span>
                                            </div>
                                        </div>

                                        <div className="mt-8 space-y-4">
                                            <Button
                                                variant="outline"
                                                className="w-full h-12 border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl flex items-center justify-center gap-2 group transition-all"
                                                onClick={() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })}
                                            >
                                                <Trophy className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
                                                Take Mastery Quiz
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Instructor Card */}
                            <Card className="bg-slate-900/50 backdrop-blur-md border-slate-700/50 rounded-2xl overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Presented by</div>
                                    <CardTitle className="text-xl text-white italic tracking-tight">Celoris Designs</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-2 border border-slate-700 flex items-center justify-center">
                                            <Brain className="h-8 w-8 text-purple-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">Celoris Designs</h4>
                                            <p className="text-xs text-slate-400">Pioneers in Agentic Personalization</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                        Bridging the gap between generic AI and truly personalized user experiences. We focus on building systems that feel human-like and contextually aware.
                                    </p>
                                    <div className="flex items-center justify-between text-sm py-3 border-t border-slate-800">
                                        <div className="flex items-center gap-1.5 text-slate-300">
                                            <Star className="h-4 w-4 fill-purple-400 text-purple-400" />
                                            <span className="font-bold">{courseData.rating}</span>
                                            <span className="text-slate-500">({courseData.students}+)</span>
                                        </div>
                                        <div className="text-slate-400">
                                            {courseData.duration}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Target Profile */}
                            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <Fingerprint className="h-5 w-5 text-purple-400" />
                                    Target Profile
                                </h3>
                                <ul className="space-y-3">
                                    {courseData.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm text-slate-400">
                                            <div className="h-1.5 w-1.5 rounded-full bg-purple-500/40 mt-1.5 flex-shrink-0" />
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
