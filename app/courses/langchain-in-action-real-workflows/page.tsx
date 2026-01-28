"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Clock, Users, Star, Award, Play, Download, CheckCircle, HelpCircle, BookOpen, Zap, Eye, Lightbulb, Battery, Cpu, Radio, Shield, BarChart, Server, Workflow, Bot, Database, Search, Mail, Code, Layers, Filter, RefreshCw, Activity, Terminal, MessageSquare, Link as LinkIcon, GitBranch, Cpu as Brain, Trophy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { InteractiveQuiz } from "@/components/InteractiveQuiz"



export default function LangChainCourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "LangChain in Action: Real Workflows | Celoris Designs";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        const desc = "Master LLM orchestration by building autonomous AI agents and automation pipelines using LangChain, Tools, and Vector Databases.";
        if (metaDescription) {
            metaDescription.setAttribute('content', desc);
        } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = desc;
            document.head.appendChild(meta);
        }
    }, []);

    const courseData = {
        title: "LangChain in Action: Real Workflows",
        subtitle: "Master LLM Orchestration—Build, Chain, and Deploy Intelligent Automation Bots.",
        description: "Move beyond simple chat prompts. Learn to build autonomous \"reasoning loops\" that use external tools, remember user history, and execute complex business logic using the industry-standard framework: LangChain.",
        students: 1250,
        rating: 4.9,
        duration: "12 hours",
        price: 13500,
        currency: "INR",
        provider: "Celoris Designs llp",
        website: "https://www.celorisdesigns.com",
        url: "https://www.celorisdesigns.com/courses/langchain-in-action-real-workflows",
        learning_outcomes: [
            "Mastering LCEL (LangChain Expression Language)",
            "Unified model management (OpenAI, Anthropic, Llama 3)",
            "Dynamic Output Parsing (JSON, Pydantic)",
            "Advanced Memory & State Management",
            "Redis & PostgreSQL for Persistent AI Memory",
            "Custom Tool & Connector Development",
            "RAG Pipelines with Vector Databases",
            "Autonomous ReAct & Zero-Shot Agents",
            "Multi-Step Automation Workflows",
            "Production Debugging with LangSmith"
        ],
        requirements: [
            "Basic Python programming knowledge",
            "Familiarity with API integrations",
            "Understanding of LLM concepts (prompts, completion)",
            "Desire to build production-ready AI automation"
        ],
        chapters: [
            {
                number: 1,
                title: "LangChain Core & Expression Language (LCEL)",
                icon: "Layers",
                videoUrl: "https://www.youtube.com/embed/Fvf5k_jocUk",
                topics: [
                    "Prompts & Models: Mastering ChatPromptTemplates and the unified interface.",
                    "The Power of LCEL: Using the pipe operator (|) to create declarative chains.",
                    "Output Parsers: Converting raw LLM strings into structured JSON or Pydantic objects.",
                    "Debugging with LangSmith: Visualizing every step of your chain execution."
                ],
                duration: "3 hours"
            },
            {
                number: 2,
                title: "State & Memory Management",
                icon: "Brain",
                topics: [
                    "Memory Types: Comparing ChatMessageHistory, ConversationBuffer, and WindowMemory.",
                    "External State Storage: Persisting conversation threads using Redis or PostgreSQL.",
                    "Entity Memory: Teaching your agent to remember specific user facts.",
                    "Context Window Management: Summarization strategies to save tokens."
                ],
                duration: "3 hours"
            },
            {
                number: 3,
                title: "Tools, Connectors & RAG",
                icon: "GitBranch",
                topics: [
                    "Defining Tools: Turning any Python function into an AI tool.",
                    "Dynamic Data (RAG): Building pipelines with Vector Databases (Pinecone/Chroma).",
                    "Built-in Toolkits: Integrating SQL, Google Search, and Gmail.",
                    "Document Loaders & Splitters: Handling PDFs, Notion, and Markdown."
                ],
                duration: "3 hours"
            },
            {
                number: 4,
                title: "Building Real-World Workflows & Agents",
                icon: "Workflow",
                topics: [
                    "Zero-Shot vs. ReAct Agents: Understanding reasoning loops.",
                    "Multi-Step Automation: Designing a research agent that emails reports.",
                    "Error Handling: Building retry logic for LLM and tool failures.",
                    "Human-in-the-Loop: Inserting approval checkpoints into workflows."
                ],
                duration: "3 hours"
            }
        ],
        faqs: [
            {
                question: "Is this course for beginners?",
                answer: "This is an intermediate course. You should know basic Python, but we guide you through the LangChain specifics from the ground up."
            },
            {
                question: "Do I need paid AI accounts?",
                answer: "While we use OpenAI and Anthropic, we also show how to use open-source models like Llama 3 via local providers."
            },
            {
                question: "What is the 'Universal Assistant' project?",
                answer: "It's a capstone project where you build a bot that connects to a knowledge base, executes database queries, and maintains long-term memory."
            },
            {
                question: "Will I get a certificate?",
                answer: "Yes, upon completion of the course and the final project, you will receive a professional certificate from Celoris Designs."
            }
        ],
        deliverables: [
            {
                title: "Universal Assistant Bot",
                description: "End-to-end automation bot with RAG and long-term memory.",
                icon: "Bot"
            },
            {
                title: "Tool Integration Kit",
                description: "Custom connectors for SQL, Gmail, and Search APIs.",
                icon: "LinkIcon"
            },
            {
                title: "LangSmith Trace Dashboard",
                description: "Ready-to-use debugging setup for complex LLM chains.",
                icon: "Activity"
            }
        ],
        reviews: [
            {
                name: "Saurabh P.",
                role: "Software Engineer",
                rating: 5,
                comment: "This course finally taught me how to think in LangChain. LCEL, state, memory, tools, RAG—everything is connected logically instead of being taught in isolation. I now design agents instead of just wiring prompts."
            },
            {
                name: "Megha R.",
                role: "AI Engineer",
                rating: 5,
                comment: "I had built basic LangChain demos before, but they always broke in real scenarios. This course shows how to handle memory, failures, debugging, and scale. The LangSmith module alone changed how I build LLM systems."
            },
            {
                name: "Aditya V.",
                role: "Backend Lead",
                rating: 5,
                comment: "Hands down the most production-oriented LangChain course I’ve taken. Redis memory, PostgreSQL persistence, structured outputs—this is what real companies expect. I applied these patterns directly at work."
            },
            {
                name: "Rohan M.",
                role: "Senior Python Developer",
                rating: 4.5,
                comment: "This is not a beginner hand-holding course, and that’s exactly why it’s good. It treats you like a serious engineer. The LCEL mindset shift helped me simplify complex workflows dramatically."
            },
            {
                name: "Ishita K.",
                role: "AI Consultant",
                rating: 5,
                comment: "The Universal Assistant project is a legit portfolio piece. It’s not a toy chatbot—it’s a full agent with tools, RAG, and long-term memory. Recruiters actually understand the value when I explain it."
            },
            {
                name: "Harsh S.",
                role: "Machine Learning Engineer",
                rating: 5,
                comment: "I finally understand how ReAct agents and zero-shot reasoning actually work in practice. The course explains why things fail, not just how to make them run once."
            },
            {
                name: "Neha D.",
                role: "Data Scientist",
                rating: 4.5,
                comment: "What I appreciated most was the focus on debugging. Most courses ignore this part. LangSmith traces, structured outputs, and evaluation techniques made my workflows reliable and observable."
            },
            {
                name: "Karthik R.",
                role: "Platform Engineer",
                rating: 5,
                comment: "This course closed the gap between tutorials and real systems. I stopped copy-pasting snippets and started designing clean, modular chains using LCEL and runnables."
            },
            {
                name: "Pritam S.",
                role: "Automation Architect",
                rating: 5,
                comment: "If you want to build AI agents for actual businesses—SQL tools, Gmail integrations, search APIs—this course shows how to do it properly. No hacks, no shortcuts."
            },
            {
                name: "Simran A.",
                role: "Product Engineer",
                rating: 5,
                comment: "I had read the LangChain docs multiple times, but they never fully clicked. This course provides the missing structure and mental model. Everything finally made sense."
            },
            {
                name: "Deepak N.",
                role: "Startup CTO",
                rating: 5,
                comment: "Worth every hour. The course doesn’t just teach LangChain—it teaches system design for LLMs. That mindset is what separates hobby projects from production software."
            },
            {
                name: "Aman J.",
                role: "Freelance AI Engineer",
                rating: 5,
                comment: "This is one of those rare courses where you feel more confident after finishing it. I can now explain, design, debug, and deploy LangChain systems end-to-end."
            },
            {
                name: "Rahul K.",
                role: "Backend Engineer",
                rating: 5,
                comment: "This is not another prompt-engineering course. I finally understand how real-world LLM systems are built. LCEL, memory, tools, RAG—everything is explained with production context. The Universal Assistant project alone is worth the price."
            },
            {
                name: "Ananya S.",
                role: "AI Developer",
                rating: 5,
                comment: "LangChain finally clicked for me. I had read the docs and watched random YouTube videos, but nothing felt complete. This course connects all the pieces—state, memory, tools, agents—into real workflows."
            },
            {
                name: "Mohit R.",
                role: "Senior Python Engineer",
                rating: 5,
                comment: "Very practical, zero fluff. What I loved most is the focus on debugging and LangSmith. Most courses stop at 'it works'. This one shows how to trace, fix, and optimize production chains."
            },
            {
                name: "Sneha P.",
                role: "Software Consultant",
                rating: 5,
                comment: "Exactly what companies expect from an AI engineer now. RAG with vector DBs, Redis memory, PostgreSQL, tool calling—this is what interviews and real projects demand. Helped me confidently pitch myself as an AI automation engineer."
            }
        ],
        quiz_data: [
            {
                title: "Core Objectives & Framework",
                questions: [
                    {
                        question: "What is the primary focus of the 'LangChain in Action' course?",
                        options: ["Simple chat prompts", "Building autonomous \"reasoning loops\"", "Basic Python syntax", "Graphic design"],
                        correctIndex: 1,
                        explanation: "The course specifically moves beyond simple chat prompts to build complex autonomous reasoning systems."
                    },
                    {
                        question: "Which industry-standard framework is used to build intelligent automation in this course?",
                        options: ["TensorFlow", "PyTorch", "LangChain", "Django"],
                        correctIndex: 2
                    },
                    {
                        question: "What does the acronym LCEL stand for?",
                        options: ["LangChain External Logic", "LangChain Expression Language", "Linear Chain Entry Level", "Logical Coding Enhanced Language"],
                        correctIndex: 1
                    },
                    {
                        question: "Which of the following models are included under \"Unified model management\"?",
                        options: ["Only OpenAI", "OpenAI and Google Gemini", "OpenAI, Anthropic, and Llama 3", "Anthropic and Midjourney"],
                        correctIndex: 2
                    },
                    {
                        question: "What is used for \"Dynamic Output Parsing\" to ensure structured data?",
                        options: ["Plain text", "JSON and Pydantic", "HTML", "XML only"],
                        correctIndex: 1
                    },
                    {
                        question: "Which databases are mentioned for \"Advanced Memory & State Management\"?",
                        options: ["MongoDB and Oracle", "Redis and PostgreSQL", "SQLite and MariaDB", "DynamoDB only"],
                        correctIndex: 1
                    },
                    {
                        question: "What specific architecture is used to connect a bot to a company's knowledge base?",
                        options: ["CNN", "RNN", "RAG Pipelines (Retrieval-Augmented Generation)", "GANs"],
                        correctIndex: 2
                    },
                    {
                        question: "Which tool is designated for \"Production Debugging\" of complex LLM chains?",
                        options: ["LangSmith", "PyCharm", "VS Code", "Postman"],
                        correctIndex: 0
                    },
                    {
                        question: "What type of autonomous agents will students learn to build?",
                        options: ["Linear agents", "ReAct and Zero-Shot agents", "Chat-only agents", "Static agents"],
                        correctIndex: 1
                    },
                    {
                        question: "What is the name of the end-to-end automation bot project?",
                        options: ["The Global Guide", "The \"Universal Assistant\" Bot", "Celoris Master Bot", "AI Orchestrator Pro"],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Tools, Integrations & Stack",
                questions: [
                    {
                        question: "The Tool Integration Kit includes custom connectors for which of the following?",
                        options: ["SQL, Gmail, and Search APIs", "Slack and Discord", "Facebook and Instagram", "WhatsApp and Telegram"],
                        correctIndex: 0
                    },
                    {
                        question: "Which tech stack version is utilised in the 2024-2025 curriculum?",
                        options: ["LangChain v0.1", "LangChain v0.2", "LangChain v0.3+", "LangChain v1.0"],
                        correctIndex: 2
                    },
                    {
                        question: "What is a prerequisite for enrolling in this course?",
                        options: ["Basic Python programming knowledge", "PhD in Data Science", "10 years of AI experience", "Knowledge of C++"],
                        correctIndex: 0
                    },
                    {
                        question: "Besides Python knowledge, what else is a prerequisite?",
                        options: ["Advanced Calculus", "Familiarity with API integrations", "Graphic design skills", "Project management certification"],
                        correctIndex: 1
                    },
                    {
                        question: "What is the cost for 'Full Lifetime Access' to the course?",
                        options: ["₹5,000", "₹10,000", "₹15,000", "₹20,000"],
                        correctIndex: 2
                    },
                    {
                        question: "What is included with the professional certification?",
                        options: ["A physical trophy", "Production Ready GitHub Templates", "A new laptop", "Free OpenAI credits"],
                        correctIndex: 1
                    },
                    {
                        question: "How many hours of content are included in the course?",
                        options: ["5 hours", "10 hours", "12 hours", "20 hours"],
                        correctIndex: 2
                    },
                    {
                        question: "Who is the instructor for the LangChain course?",
                        options: ["Celoris (Expert AI Engineer)", "A generic AI bot", "A guest professor", "Anonymous"],
                        correctIndex: 0
                    },
                    {
                        question: "What is the instructor's rating based on the sources?",
                        options: ["4.5", "4.7", "4.9", "5.0"],
                        correctIndex: 2
                    },
                    {
                        question: "Which company is responsible for the Celoris AI-Powered Ecosystem?",
                        options: ["Celoris Tech Ltd", "Celoris Designs LLP", "AI Global Partners", "LangChain Corp"],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Platform & Logistics",
                questions: [
                    {
                        question: "What are the four main pillars of the Celoris platform?",
                        options: ["Read, Write, Speak, Listen", "Learn, Earn, Social, Apps", "Build, Deploy, Test, Scale", "Code, Design, Market, Sell"],
                        correctIndex: 1
                    },
                    {
                        question: "Where can students join for 'Exclusive' interaction?",
                        options: ["A private WhatsApp group", "Exclusive Discord Community", "LinkedIn group", "Facebook page"],
                        correctIndex: 1
                    },
                    {
                        question: "The course promises to move 'beyond' which of the following?",
                        options: ["Python coding", "Simple chat prompts", "API calls", "Database management"],
                        correctIndex: 1
                    },
                    {
                        question: "'Persistent AI Memory' is achieved using which combination?",
                        options: ["Flash drive and Cloud", "Redis & PostgreSQL", "RAM and Hard Drive", "Cache and Cookies"],
                        correctIndex: 1
                    },
                    {
                        question: "Which specific capability allows agents to use external tools?",
                        options: ["Hardcoding", "Autonomous reasoning loops", "Manual intervention", "Basic if-else statements"],
                        correctIndex: 1
                    },
                    {
                        question: "What can students stay 'Synchronised' with by following the platform?",
                        options: ["Only price changes", "New knowledge nodes and grid opportunities", "Weather updates", "Stock market trends"],
                        correctIndex: 1
                    },
                    {
                        question: "What kind of workflows are taught in the course?",
                        options: ["Single-step prompts", "Multi-Step Automation Workflows", "Manual data entry", "Offline workflows"],
                        correctIndex: 1
                    },
                    {
                        question: "Which of the following is NOT a prerequisite mentioned in the source?",
                        options: ["Understanding of LLM concepts", "Desire to build production-ready AI", "Expertise in React.js", "Basic Python programming"],
                        correctIndex: 2
                    },
                    {
                        question: "LangSmith provides a dashboard for which of the following?",
                        options: ["Designing logos", "Tracing and debugging complex LLM chains", "Buying tokens", "Hosting websites"],
                        correctIndex: 1
                    },
                    {
                        question: "The 'Universal Assistant' bot connects to what for its RAG capabilities?",
                        options: ["A public library", "A company's knowledge base", "Random Wikipedia pages", "YouTube transcripts only"],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Advanced Agents & RAG",
                questions: [
                    {
                        question: "What is a 'Zero-Shot' agent?",
                        options: ["An agent that never works", "An agent that performs tasks without prior examples", "An agent that requires 100 prompts", "A human-in-the-loop system"],
                        correctIndex: 1
                    },
                    {
                        question: "What is the copyright year mentioned for Celoris Designs LLP?",
                        options: ["2024", "2025", "2026", "2023"],
                        correctIndex: 2
                    },
                    {
                        question: "What is the instructor's specific area of expertise?",
                        options: ["Web development", "LLM Orchestration Specialist", "Cyber security", "Hardware engineering"],
                        correctIndex: 1
                    },
                    {
                        question: "Vector Databases are specifically mentioned in the context of:",
                        options: ["Saving images", "RAG Pipelines", "Deleting logs", "Calculating math"],
                        correctIndex: 1
                    },
                    {
                        question: "Which of the following is part of the 'Connect' section of the platform?",
                        options: ["Careers", "Newsletter, Community, Events, Partners", "Help Center", "Terms of Service"],
                        correctIndex: 1
                    },
                    {
                        question: "The 'Universal Assistant' project involves building an 'End-to-End' what?",
                        options: ["Chat interface", "Automation Bot", "Search Engine", "Social Network"],
                        correctIndex: 1
                    },
                    {
                        question: "Which concept involves 'Prompts and Completion'?",
                        options: ["Database management", "LLM concepts (Prerequisite)", "Networking", "Hardware assembly"],
                        correctIndex: 1
                    },
                    {
                        question: "What is the status of the 'Protocol' mentioned in the footer?",
                        options: ["Inactive", "Active", "Pending", "Error"],
                        correctIndex: 1
                    },
                    {
                        question: "'Pydantic' is primarily used in this course for:",
                        options: ["Styling CSS", "Dynamic Output Parsing", "Setting up servers", "Encrypting passwords"],
                        correctIndex: 1
                    },
                    {
                        question: "Which of these is a 'Support' category on the platform?",
                        options: ["Social", "Help Center", "Newsletter", "Partners"],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Operational Excellence",
                questions: [
                    {
                        question: "The course is described as providing 'Real ______':",
                        options: ["Stories", "Workflows", "People", "Problems"],
                        correctIndex: 1
                    },
                    {
                        question: "Which 'Company' link would you click to find employment?",
                        options: ["About", "Contact", "Careers", "Blog"],
                        correctIndex: 2
                    },
                    {
                        question: "How many people are indicated to have rated the instructor/course?",
                        options: ["500+", "1000+", "1250+", "2000+"],
                        correctIndex: 2
                    },
                    {
                        question: "'Unified model management' helps a developer avoid:",
                        options: ["Writing Python", "Managing multiple different LLM interfaces separately", "Using the internet", "Paying for APIs"],
                        correctIndex: 1
                    },
                    {
                        question: "What does the 'Earn' section of the platform likely refer to?",
                        options: ["Spending money", "Opportunities for income/rewards", "Learning for free", "Social media likes"],
                        correctIndex: 1
                    },
                    {
                        question: "Multi-step automation is a move away from:",
                        options: ["Computers", "Simple, single-response AI", "Python", "The cloud"],
                        correctIndex: 1
                    },
                    {
                        question: "'Custom Tool & Connector Development' allows the AI to:",
                        options: ["Change its own code", "Interact with external software like Gmail", "Sleep", "Play games"],
                        correctIndex: 1
                    },
                    {
                        question: "ReAct agents stand for:",
                        options: ["Reacting to people", "Reasoning and Acting", "Redux and Actions", "Read and Account"],
                        correctIndex: 1
                    },
                    {
                        question: "Which of the following is NOT a model mentioned in the core stack?",
                        options: ["Llama 3", "Anthropic", "Claude 2", "OpenAI"],
                        correctIndex: 2
                    },
                    {
                        question: "The 'Universal Assistant' bot is designed to maintain:",
                        options: ["Long-term memory", "No history", "Only the last message", "Temporary cache only"],
                        correctIndex: 0
                    }
                ]
            },
            {
                title: "Prompt Template Fundamentals",
                questions: [
                    {
                        question: "Which LangChain class is specifically designed for completion-style models that expect a single text input?",
                        options: ["ChatPromptTemplate", "PromptTemplate", "MessagesPlaceholder", "StructuredOutputParser"],
                        correctIndex: 1,
                        explanation: "PromptTemplate is used for creating basic string-based prompts for completion models like text-davinci-003."
                    },
                    {
                        question: "Chat-based models (e.g., GPT-4, Gemini) expect messages structured with specific roles. Which of these is NOT a standard role?",
                        options: ["System", "Human", "Moderator", "AI"],
                        correctIndex: 2,
                        explanation: "Standard roles include \"system\", \"human\" (user), and \"ai\" (assistant)."
                    },
                    {
                        question: "What is the primary purpose of MessagesPlaceholder?",
                        options: ["To act as a fallback when a model fails.", "To inject a dynamic list of messages, such as conversation history, into a prompt.", "To validate that all input variables are strings.", "To convert JSON into Pydantic objects."],
                        correctIndex: 1,
                        explanation: "MessagesPlaceholder acts as a stand-in for a dynamic sequence of messages provided at runtime."
                    },
                    {
                        question: "When using ChatPromptTemplate.from_messages, how is a message typically represented?",
                        options: ["A dictionary with \"role\" and \"text\" keys.", "A 2-tuple of (role, template string).", "A single string containing the entire conversation.", "A list of integers representing tokens."],
                        correctIndex: 1,
                        explanation: "It is typically defined as a sequence of message representations, often 2-tuples like (\"system\", \"template\")."
                    },
                    {
                        question: "What happens if you invoke a LangChain prompt template with a dictionary missing a required placeholder variable?",
                        options: ["It returns a partial prompt.", "It triggers a runtime error.", "It automatically fills the blank with \"None\".", "The editor warns you before execution."],
                        correctIndex: 1,
                        explanation: "LangChain’s prompt templates generally do not offer built-in editor support, meaning errors regarding missing keys often only appear at runtime."
                    },
                    {
                        question: "Which method allows you to pre-fill some variables in a template while leaving others to be filled later?",
                        options: [".bind()", ".partial()", ".invoke()", ".batch()"],
                        correctIndex: 1,
                        explanation: "Partial formatting allows you to predefine certain variables in a template while leaving others open for later customisation."
                    },
                    {
                        question: "How does the from_template method in ChatPromptTemplate behave differently from PromptTemplate?",
                        options: ["It creates a single message assumed to be from the human.", "It requires a system message by default.", "It cannot accept variables.", "It only works with local models."],
                        correctIndex: 0,
                        explanation: "ChatPromptTemplate.from_template creates a template consisting of a single message assumed to be from the human."
                    },
                    {
                        question: "In a production setting, what is a key benefit of using a \"System\" message?",
                        options: ["It collects user feedback.", "It defines global behaviour, tone, and operational boundaries for the LLM.", "It reduces the cost per token by 50%.", "It acts as a primary retriever for vector databases."],
                        correctIndex: 1,
                        explanation: "System messages define the model's persona, constraints, and operational boundaries."
                    },
                    {
                        question: "What is the default template format used by LangChain?",
                        options: ["Jinja2", "Mustache", "f-string", "YAML"],
                        correctIndex: 2,
                        explanation: "The template_format defaults to \"f-string\"."
                    },
                    {
                        question: "Which method would you use to convert a ChatPromptTemplate into a list of message objects?",
                        options: [".to_json()", ".format_messages()", ".extract_roles()", ".get_history()"],
                        correctIndex: 1,
                        explanation: ".format_messages() fills in the template variables and returns a list of structured message objects."
                    }
                ]
            },
            {
                title: "LCEL and the Pipe Operator",
                questions: [
                    {
                        question: "What does the pipe operator (|) signify in the LangChain Expression Language (LCEL)?",
                        options: ["Logical \"OR\" condition.", "Chaining components so the output of one becomes the input of the next.", "Parallel execution of all components.", "Dividing the token limit between two models."],
                        correctIndex: 1,
                        explanation: "LCEL uses the pipe operator to connect modular building blocks into a seamless data flow."
                    },
                    {
                        question: "Every component in LCEL (prompts, models, parsers) implements which standard interface?",
                        options: ["The Agent protocol.", "The Chain class.", "The Runnable protocol.", "The Flow interface."],
                        correctIndex: 2,
                        explanation: "At the heart of LCEL is the Runnable protocol, ensuring a consistent API across all components."
                    },
                    {
                        question: "Which invocation method is used for real-time token delivery?",
                        options: [".invoke()", ".batch()", ".stream()", ".ainvoke()"],
                        correctIndex: 2,
                        explanation: ".stream() is used for incremental streaming to allow a faster time-to-first-token."
                    },
                    {
                        question: "Why is LCEL considered \"declarative\" rather than \"imperative\"?",
                        options: ["It requires users to write their own loops for every call.", "Users describe what the chain does rather than how to execute every manual step.", "It only works with pre-declared global variables.", "It cannot be used with Python functions."],
                        correctIndex: 1,
                        explanation: "LCEL allows developers to describe the chain's structure, which the framework then executes, reducing boilerplate code."
                    },
                    {
                        question: "What is the main advantage of using .batch() over calling .invoke() multiple times in a loop?",
                        options: ["It is cheaper per token.", "It handles parallelisation client-side for more efficient processing.", "It automatically retries failed calls with different models.", "It translates the prompt into multiple languages."],
                        correctIndex: 1,
                        explanation: ".batch() is faster because it handles parallelisation for multiple inputs simultaneously."
                    },
                    {
                        question: "In the LCEL expression chain = prompt | model | parser, what is the output of the model step?",
                        options: ["A raw JSON string.", "A PromptValue.", "An AIMessage.", "A Pydantic object."],
                        correctIndex: 2,
                        explanation: "The model receives a PromptValue and outputs an AIMessage."
                    },
                    {
                        question: "What inspired the syntax of the LCEL pipe operator?",
                        options: ["JavaScript Promises.", "Unix/Linux pipe functionality.", "C++ templates.", "SQL JOIN statements."],
                        correctIndex: 1,
                        explanation: "LCEL is inspired by the Linux pipe functionality where output is passed to the next function."
                    },
                    {
                        question: "Which environment variable is typically used to enable LangSmith tracing for LCEL chains?",
                        options: ["LANGCHAIN_DEBUG=true", "LANGSMITH_TRACING=true", "ENABLE_LCEL_LOGS=1", "TRACE_ALL_LLMS=yes"],
                        correctIndex: 1,
                        explanation: "Setting LANGSMITH_TRACING=true (or LANGCHAIN_TRACING_V2=true) automatically logs runs to LangSmith."
                    },
                    {
                        question: "What is a \"Legacy Chain\" in the context of LangChain's evolution?",
                        options: ["A chain that only uses GPT-2.", "Monolithic classes like LLMChain or SimpleSequentialChain used before LCEL.", "Any chain that doesn't use a vector database.", "Chains written in COBOL."],
                        correctIndex: 1,
                        explanation: "Early versions relied on \"classic\" monolithic classes like LLMChain, which are now being phased out in favour of LCEL."
                    },
                    {
                        question: "Which LCEL method is best for high-concurrency web servers to prevent blocking the event loop?",
                        options: [".invoke()", ".ainvoke()", ".batch()", ".stream()"],
                        correctIndex: 1,
                        explanation: ".ainvoke() is the asynchronous version of invoke, critical for maintaining application SLAs in high-concurrency environments."
                    }
                ]
            },
            {
                title: "Advanced Runnables and Logic",
                questions: [
                    {
                        question: "Which Runnable type is used to execute multiple paths simultaneously, such as querying two retrievers?",
                        options: ["RunnablePassthrough", "RunnableLambda", "RunnableParallel", "RunnableRetry"],
                        correctIndex: 2,
                        explanation: "RunnableParallel allows for the concurrent execution of multiple runnables, reducing total latency."
                    },
                    {
                        question: "What does RunnablePassthrough do?",
                        options: ["It ignores the input and returns a random string.", "It acts as an identity function, passing data through unchanged to the next step.", "It automatically translates the input for the model.", "It parses the output into a dictionary."],
                        correctIndex: 1,
                        explanation: "RunnablePassthrough allows data to flow through a step unchanged, often used to preserve the original question alongside retrieved context."
                    },
                    {
                        question: "How can you turn a standard Python function into a component that can be used with the pipe operator?",
                        options: ["By wrapping it in RunnableLambda.", "By naming the function \"runnable_func\".", "By using the | operator inside the function.", "By saving the function as a .json file."],
                        correctIndex: 0,
                        explanation: "RunnableLambda permits the injection of arbitrary Python functions into an LCEL chain."
                    },
                    {
                        question: "In LCEL, how do you provide extra arguments to a model that aren't part of the previous step's output (e.g., a \"stop\" sequence)?",
                        options: ["Use the .partial() method.", "Use the .bind() method.", "Hardcode it into the prompt template.", "Use RunnablePassthrough."],
                        correctIndex: 1,
                        explanation: ".bind() is used to bind arguments to a Runnable that are not in the user input or previous output."
                    },
                    {
                        question: "What is the purpose of with_fallbacks() in a LangChain runnable?",
                        options: ["To add extra examples to the prompt.", "To define a sequence of alternative runnables to try if the primary one fails.", "To convert a Chat model into a Completion model.", "To limit the number of tokens used."],
                        correctIndex: 1,
                        explanation: "with_fallbacks() adds a sequence of runnables to try in order upon failure."
                    },
                    {
                        question: "Which feature allows you to choose between different models at runtime based on a configuration key?",
                        options: ["RunnableParallel", "configurable_alternatives", "with_structured_output", "MessagesPlaceholder"],
                        correctIndex: 1,
                        explanation: "configurable_alternatives allows configuring alternatives for Runnables that can be set at runtime."
                    },
                    {
                        question: "What is a \"Branching Chain\"?",
                        options: ["A chain that only uses one model.", "A flow where one step's result is split into several paths processed independently.", "A chain that has been deprecated.", "A chain that requires a GitHub account to run."],
                        correctIndex: 1,
                        explanation: "In branching chains, one step produces a result that is split into several paths, often processed in parallel."
                    },
                    {
                        question: "How does RunnableParallel handle inputs?",
                        options: ["It splits the input string in half for each branch.", "It provides the same input to each branch in the mapping.", "It waits for the first branch to finish before starting the second.", "It converts the input into a list of integers."],
                        correctIndex: 1,
                        explanation: "It invokes branches concurrently, providing the same input to each."
                    },
                    {
                        question: "Which of these is a limitation of LCEL noted in the sources?",
                        options: ["It is too fast for most models.", "It makes debugging long or nested chains difficult.", "It cannot be used with OpenAI.", "It only supports English."],
                        correctIndex: 1,
                        explanation: "Debugging long or nested LCEL chains can be difficult, and managing complex state is tricky."
                    },
                    {
                        question: "What is the \"Runnable Protocol\" contract?",
                        options: ["input → processing → output", "prompt → token → response", "user → system → assistant", "login → query → logout"],
                        correctIndex: 0,
                        explanation: "Every component implements a clear input → processing → output contract."
                    }
                ]
            },
            {
                title: "Structured Outputs and Evaluation",
                questions: [
                    {
                        question: "Which method is the modern industry standard for extracting structured data from models that natively support it?",
                        options: ["PydanticOutputParser", ".with_structured_output()", "StrOutputParser", "RegexParser"],
                        correctIndex: 1,
                        explanation: ".with_structured_output() is the standard for models supporting structured data natively through APIs."
                    },
                    {
                        question: "Why is Pydantic recommended for structured outputs?",
                        options: ["It makes the model 20% faster.", "It provides strict type checking, field validation, and support for nested structures.", "It is the only library that works with Python 2.", "It removes the need for an API key."],
                        correctIndex: 1,
                        explanation: "Pydantic is highly recommended for its support of strict type checking and field validation."
                    },
                    {
                        question: "What is the fallback if a model does not natively support structured output?",
                        options: ["Use a PydanticOutputParser with prompt instructions.", "The chain will automatically stop.", "The model will use random JSON.", "You must switch to a Completion model."],
                        correctIndex: 0,
                        explanation: "For models without native support, traditional output parsers like PydanticOutputParser are used."
                    },
                    {
                        question: "What does the OutputFixingParser do?",
                        options: ["It translates the output into French.", "It captures validation errors and asks the LLM to fix the formatting.", "It reduces the token count of the response.", "It adds a signature to the end of the text."],
                        correctIndex: 1,
                        explanation: "It attempts to fix formatting automatically or prompts the model to retry with the error message as feedback."
                    },
                    {
                        question: "In LangSmith, what is a \"Trace\"?",
                        options: ["A single line of code.", "A record of every step and LLM call in an application for a specific request.", "A list of all your API keys.", "A method to delete old data."],
                        correctIndex: 1,
                        explanation: "A trace records every step and LLM call in your application for debugging."
                    },
                    {
                        question: "What is \"LLM-as-a-judge\"?",
                        options: ["Using an LLM to write legal documents.", "Using a high-capacity LLM to evaluate the quality of another model's output.", "A model that has been trained on courtroom transcripts.", "A LangChain component that blocks harmful prompts."],
                        correctIndex: 1,
                        explanation: "It involves using an LLM to grade responses against a prompt or rubric."
                    },
                    {
                        question: "Which LangSmith feature allows you to test prompts in the UI without redeploying code?",
                        options: ["Tracing", "Playground", "Datasets", "Evaluators"],
                        correctIndex: 1,
                        explanation: "The Playground allows for real-time testing of prompts and models."
                    },
                    {
                        question: "What is the benefit of a \"binary pass/fail\" evaluation system for domain experts?",
                        options: ["It is more mathematically complex.", "It keeps evaluations focused, fast, and aligned with production readiness.", "It is only used for very simple models.", "It prevents the model from generating text."],
                        correctIndex: 1,
                        explanation: "Binary pass/fail systems keep evaluations fast and aligned with real-world goals."
                    },
                    {
                        question: "How does init_chat_model help developers?",
                        options: ["It automatically writes the code for the agent.", "It provides a unified interface to initialize models from various providers using a consistent syntax.", "It makes all models free to use.", "It only works for local models like Ollama."],
                        correctIndex: 1,
                        explanation: "It supports a wide range of providers with a consistent syntax, reducing vendor lock-in."
                    },
                    {
                        question: "What is \"Token Optimization\" in prompt engineering?",
                        options: ["Buying tokens at a discount.", "Reducing redundancy in templates to achieve more consistent outputs and cut costs.", "Using only the most common words in English.", "Increasing the max_tokens limit to 1 million."],
                        correctIndex: 1,
                        explanation: "Token optimisation involves reducing redundancy while maintaining clarity to cut costs and improve consistency."
                    }
                ]
            },
            {
                title: "Comparisons and Best Practices",
                questions: [
                    {
                        question: "According to the sources, why might a developer choose Mirascope over LangChain?",
                        options: ["LangChain is too simple.", "Mirascope uses native Python and Pydantic without requiring new complex abstractions like Runnables.", "Mirascope is written in C++.", "LangChain does not support OpenAI."],
                        correctIndex: 1,
                        explanation: "Mirascope is designed to be a lightweight toolkit using native Python, avoiding the learning curve of custom abstractions."
                    },
                    {
                        question: "How does the Lilypad framework handle versioning differently from LangChain Hub?",
                        options: ["It requires manual \"Save as\" clicks for every change.", "It automatically versions the entire code context, including model settings and logic, behind the scenes.", "It only versions the prompt string.", "It uses a blockchain to store prompts."],
                        correctIndex: 1,
                        explanation: "Lilypad automatically versions the entire context (code, model, parameters) and handles it behind the scenes."
                    },
                    {
                        question: "What is the recommended strategy for handling high-latency agentic runs in production?",
                        options: ["Blocking the main thread until the agent finishes.", "Implementing token-by-token streaming to improve \"perceived latency\".", "Using only the smallest available models.", "Disabling all logging."],
                        correctIndex: 1,
                        explanation: "Implementing token-by-token streaming is the most effective way to improve perceived latency."
                    },
                    {
                        question: "What \"leaky abstraction\" warning is given regarding structured outputs?",
                        options: ["Smaller models like GPT-3.5 are more reliable than GPT-4.", "Even with structured output settings, larger models are significantly more reliable at adhering to complex schemas.", "JSON is not a real data format.", "Pydantic cannot be used with LCEL."],
                        correctIndex: 1,
                        explanation: "Larger models are significantly more reliable for complex schemas."
                    },
                    {
                        question: "In LangChain, what does \"Partialing\" a prompt allow you to do?",
                        options: ["Only send half the prompt to the model to save money.", "Bind some variables now and others later.", "Delete variables from a template.", "Use a template that only works 50% of the time."],
                        correctIndex: 1,
                        explanation: "Partial variables populate the template so you don’t need to pass them in every time."
                    },
                    {
                        question: "Which tool offers a visual drag-and-drop builder for LangChain prompts for non-programmers?",
                        options: ["LangSmith", "Latenode", "Mirascope", "Pydantic"],
                        correctIndex: 1,
                        explanation: "Latenode offers a visual drag-and-drop builder, making prompt creation accessible to non-programmers."
                    },
                    {
                        question: "What is the \"Long-Term Support (LTS)\" philosophy in LangChain Core?",
                        options: ["Support for only one week after release.", "A commitment to stability and a designated maintenance period to ensure enterprise-grade reliability.", "It means the software will never be updated.", "It only applies to the JavaScript version."],
                        correctIndex: 1,
                        explanation: "LTS ensures breaking changes are reserved for major versions and provides maintenance support."
                    },
                    {
                        question: "Why is \"Context Pruning\" important in RAG systems?",
                        options: ["To make the prompt as long as possible.", "To minimize token usage and latency by removing redundant information.", "To prevent the model from seeing the user's question.", "To ensure the model only uses internal training data."],
                        correctIndex: 1,
                        explanation: "Developers should rank documents and prune redundant context to minimize cost and latency."
                    },
                    {
                        question: "How does Lilypad facilitate collaboration between developers and domain experts?",
                        options: ["By requiring domain experts to learn Python.", "By providing a playground UI where non-technical users can test and edit prompts independently of code deployment.", "By automatically translating code into plain English.", "By giving everyone the same admin password."],
                        correctIndex: 1,
                        explanation: "The playground allows non-technical experts to run prompts and evaluate outputs without developers needing to redeploy code."
                    },
                    {
                        question: "What is the \"Applications of the Future\" thesis mentioned by LangChain’s founders?",
                        options: ["Moving away from AI altogether.", "Autonomous, stateful agents capable of complex reasoning loops and human-in-the-loop support.", "Simple linear chains for everyone.", "Using LLMs only for spell-checking."],
                        correctIndex: 1,
                        explanation: "The future involves move toward complex, autonomous, and stateful systems like LangGraph."
                    }
                ]
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "LangChain in Action: Real Workflows",
        "description": "Master LLM orchestration by building autonomous AI agents and automation pipelines using LangChain, Tools, and Vector Databases.",
        "provider": {
            "@type": "Organization",
            "name": "celoris designs",
            "sameAs": "https://www.celorisdesigns.com"
        },
        "courseCode": "LC-ACT-02",
        "educationalLevel": "Intermediate",
        "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "Online",
            "courseWorkload": "PT12H",
            "instructor": {
                "@type": "Person",
                "name": "Expert AI Engineer",
                "jobTitle": "LLM Orchestration Specialist"
            }
        },
        "syllabusSections": [
            {
                "@type": "Syllabus",
                "name": "LangChain Core & LCEL",
                "description": "Mastering the LangChain Expression Language for composable AI chains."
            },
            {
                "@type": "Syllabus",
                "name": "State & Memory",
                "description": "Managing conversation history and persistent state across LLM sessions."
            },
            {
                "@type": "Syllabus",
                "name": "Tools & RAG",
                "description": "Connecting LLMs to external APIs, SQL databases, and Vector stores."
            },
            {
                "@type": "Syllabus",
                "name": "Autonomous Agents",
                "description": "Building ReAct agents that plan and execute multi-step automation tasks."
            }
        ],
        "offers": {
            "@type": "Offer",
            "category": "Paid",
            "price": "149.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-8 selection:bg-blue-500/30">
            {/* JSON-LD Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
                    <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-blue-400 transition-colors">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-blue-400 transition-colors">Courses</Link>
                    <span>/</span>
                    <span className="text-slate-100 line-clamp-1">LangChain in Action</span>
                </div>

                {/* Back Button */}
                <Link href="/learn/courses" className="inline-flex items-center text-slate-400 hover:text-blue-400 mb-6 transition-all group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Course Header */}
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">AI Orchestration</span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Agents</span>
                                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Python</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                                {courseData.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-blue-400/90 font-medium">
                                {courseData.subtitle}
                            </p>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
                                {courseData.description}
                            </p>
                        </div>

                        {/* Course Preview Video with Glassmorphism */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Card className="relative overflow-hidden border-0 bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-3xl">
                                <div className="aspect-video relative overflow-hidden">
                                    <iframe
                                        className="w-full h-full"
                                        src="https://www.youtube.com/embed/Fvf5k_jocUk?rel=0&showinfo=0&autoplay=0"
                                        title="LangChain in Action Course Preview"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </Card>
                        </div>

                        {/* Core Promise / Learning Outcomes */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-blue-400" />
                                </div>
                                What You Will Master
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courseData.learning_outcomes.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-blue-500/30 transition-colors group">
                                        <div className="h-5 w-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-500/20 transition-colors">
                                            <CheckCircle className="h-3 w-3 text-blue-400" />
                                        </div>
                                        <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Course Curriculum */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <BookOpen className="h-6 w-6 text-purple-400" />
                                </div>
                                Curriculum Overview
                            </h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {courseData.chapters.map((chapter, index) => {
                                    const icons: Record<string, any> = {
                                        Layers,
                                        Brain,
                                        GitBranch,
                                        Workflow
                                    };
                                    const Icon = icons[chapter.icon] || BookOpen;
                                    return (
                                        <AccordionItem key={index} value={`chapter-${index}`} className="border border-slate-700/50 bg-slate-900/40 rounded-xl px-2 overflow-hidden">
                                            <AccordionTrigger className="hover:no-underline py-6">
                                                <div className="flex items-center gap-4 text-left w-full">
                                                    <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 shadow-inner">
                                                        <Icon className="h-6 w-6 text-blue-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Module {chapter.number}</div>
                                                        <div className="text-lg font-semibold text-white">{chapter.title}</div>
                                                    </div>
                                                    <div className="hidden sm:flex items-center gap-2 text-slate-400 text-sm mr-4 bg-slate-800/50 px-3 py-1 rounded-full">
                                                        <Clock className="h-4 w-4" />
                                                        {chapter.duration}
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-6 px-4">
                                                <div className="pl-14 space-y-4">
                                                    <div className="h-px bg-gradient-to-r from-blue-500/30 to-transparent mb-4"></div>

                                                    {chapter.videoUrl && (
                                                        <div className="mb-6 rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl bg-slate-950">
                                                            <div className="aspect-video">
                                                                <iframe
                                                                    className="w-full h-full"
                                                                    src={`${chapter.videoUrl}?rel=0&showinfo=0`}
                                                                    title={`${chapter.title} Video Content`}
                                                                    frameBorder="0"
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                    allowFullScreen
                                                                ></iframe>
                                                            </div>
                                                            <div className="p-3 bg-slate-900/50 border-t border-slate-800 flex items-center justify-between">
                                                                <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400/80 uppercase tracking-widest">
                                                                    <Play className="h-3 w-3 fill-blue-400" /> Lesson Preview
                                                                </div>
                                                                <div className="text-[10px] text-slate-500 font-medium">
                                                                    Module {chapter.number} Support Video
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <ul className="grid grid-cols-1 gap-3">
                                                        {chapter.topics.map((topic, topicIndex) => (
                                                            <li key={topicIndex} className="flex items-start gap-3 text-slate-400 group">
                                                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500/40 mt-2 group-hover:bg-blue-500 transition-colors" />
                                                                <span className="text-sm leading-relaxed">{topic}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    );
                                })}
                            </Accordion>
                        </section>

                        {/* Deliverables / Feature Grid */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Bot className="h-6 w-6 text-blue-400" />
                                </div>
                                Project: The \"Universal Assistant\" Bot
                            </h2>
                            <p className="text-slate-400 mb-8">
                                By the end of this course, you will build and deploy an End-to-End Automation Bot that connects to your company's knowledge base (RAG), executes tasks via Tools, and maintains long-term memory.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {courseData.deliverables.map((item, index) => {
                                    const icons: Record<string, any> = {
                                        Bot,
                                        LinkIcon,
                                        Activity
                                    };
                                    const Icon = icons[item.icon] || Bot;
                                    return (
                                        <Card key={index} className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 hover:border-blue-500/40 transition-all duration-300 group">
                                            <CardContent className="pt-8 text-center">
                                                <div className="mx-auto bg-slate-700/50 p-4 w-fit rounded-2xl border border-slate-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                                    <Icon className="h-8 w-8 text-blue-400" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                                                <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </section>

                        {/* Student Reviews Section - Animated Marquee */}
                        <section className="space-y-8 overflow-hidden">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3 px-4 sm:px-0">
                                <div className="p-2 bg-yellow-500/20 rounded-lg">
                                    <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                                </div>
                                Student Success Stories
                            </h2>

                            <div className="relative space-y-6">
                                {/* First Row - Right to Left */}
                                <div className="flex overflow-hidden group">
                                    <motion.div
                                        animate={{ x: [0, -2500] }}
                                        transition={{
                                            duration: 60,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                        className="flex gap-6 whitespace-nowrap"
                                    >
                                        {[...courseData.reviews, ...courseData.reviews].slice(0, 16).map((review, index) => (
                                            <Card key={index} className="w-[400px] shrink-0 bg-slate-900/40 border-slate-800 hover:border-blue-500/30 transition-all duration-300">
                                                <CardContent className="p-6">
                                                    <div className="flex gap-1 mb-4">
                                                        {[...Array(Math.floor(review.rating))].map((_, i) => (
                                                            <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                        ))}
                                                        {review.rating % 1 !== 0 && <Star className="h-3 w-3 fill-yellow-500/50 text-yellow-500" />}
                                                    </div>
                                                    <p className="text-slate-300 text-sm leading-relaxed mb-6 whitespace-normal italic">
                                                        "{review.comment}"
                                                    </p>
                                                    <div className="flex items-center gap-3 border-t border-slate-800 pt-4">
                                                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20">
                                                            {review.name.charAt(0)}
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="text-sm font-bold text-white">{review.name}</div>
                                                            <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">{review.role}</div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </motion.div>
                                </div>

                                {/* Second Row - Left to Right */}
                                <div className="flex overflow-hidden group">
                                    <motion.div
                                        animate={{ x: [-2500, 0] }}
                                        transition={{
                                            duration: 70,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                        className="flex gap-6 whitespace-nowrap"
                                    >
                                        {[...courseData.reviews, ...courseData.reviews].slice(8, 24).map((review, index) => (
                                            <Card key={index} className="w-[400px] shrink-0 bg-slate-900/40 border-slate-800 hover:border-blue-500/30 transition-all duration-300">
                                                <CardContent className="p-6">
                                                    <div className="flex gap-1 mb-4">
                                                        {[...Array(Math.floor(review.rating))].map((_, i) => (
                                                            <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                        ))}
                                                        {review.rating % 1 !== 0 && <Star className="h-3 w-3 fill-yellow-500/50 text-yellow-500" />}
                                                    </div>
                                                    <p className="text-slate-300 text-sm leading-relaxed mb-6 whitespace-normal italic">
                                                        "{review.comment}"
                                                    </p>
                                                    <div className="flex items-center gap-3 border-t border-slate-800 pt-4">
                                                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20">
                                                            {review.name.charAt(0)}
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="text-sm font-bold text-white">{review.name}</div>
                                                            <div className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">{review.role}</div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </motion.div>
                                </div>

                                {/* Gradient Overlays for smooth edges */}
                                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#020617] to-transparent z-10 pointer-events-none" />
                                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#020617] to-transparent z-10 pointer-events-none" />
                            </div>
                        </section>

                        {/* FAQ Section */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-orange-500/20 rounded-lg">
                                    <HelpCircle className="h-6 w-6 text-orange-400" />
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

                        {/* Interactive Quiz Section */}
                        <section id="quiz" className="pt-12 border-t border-slate-800/50">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <Trophy className="h-6 w-6 text-blue-400" />
                                    </div>
                                    LangChain & AI Orchestration Mastery Assessment
                                </h2>
                                <p className="text-slate-400 mt-2">Validate your expertise in building autonomous agents, RAG pipelines, and complex LLM workflows.</p>
                            </div>
                            <InteractiveQuiz
                                quizTitle="LangChain & AI Orchestration Mastery Assessment"
                                quizDescription="100 questions covering the end-to-end LangChain ecosystem and production-ready AI automation."
                                quizUnits={courseData.quiz_data}
                                onCompleteMessage={(score) => {
                                    if (score >= 90) return "Architect Level! You are fully prepared to build and deploy complex autonomous agents.";
                                    if (score >= 70) return "Orchestration Ready! You have a solid grasp of LangChain and RAG architectures.";
                                    return "Keep Building! Review the memory and tool integration modules to strengthen your automation skills.";
                                }}
                            />
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-8">
                            {/* Enrollment Card */}
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                <Card className="relative bg-slate-900 border-0 rounded-3xl overflow-hidden shadow-2xl">
                                    <CardContent className="p-8">
                                        <div className="text-center mb-8">
                                            <div className="flex items-center justify-center gap-3 mb-2">
                                                <div className="text-5xl font-extrabold text-white tracking-tighter">
                                                    ₹13,500
                                                </div>
                                            </div>
                                            <div className="text-blue-400 font-bold tracking-widest uppercase text-xs">Full Lifetime Access</div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <CourseInquiryDialog
                                                courseTitle={courseData.title}
                                                buttonClassName="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white rounded-2xl shadow-lg shadow-blue-500/25 transition-all active:scale-95"
                                            />
                                            <Button
                                                variant="outline"
                                                className="w-full h-12 border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl"
                                                onClick={() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })}
                                            >
                                                Take Assessment Quiz
                                            </Button>
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-slate-800">
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Award className="h-5 w-5 text-blue-400" />
                                                <span>Professional Certification</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Code className="h-5 w-5 text-purple-400" />
                                                <span>Production Ready GitHub Templates</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Users className="h-5 w-5 text-indigo-400" />
                                                <span>Exclusive Discord Community</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Zap className="h-5 w-5 text-orange-400" />
                                                <span>2024-2025 Tech Stack (LangChain v0.3+)</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Instructor Card */}
                            <Card className="bg-slate-900/50 backdrop-blur-md border-slate-700/50 rounded-2xl overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Instructor</div>
                                    <CardTitle className="text-xl text-white">Celoris</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white p-2.5 shadow-lg shadow-white/10 border border-slate-200 flex items-center justify-center">
                                            <img src="/celoris-logo.png" alt="Celoris" className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">Expert AI Engineer</h4>
                                            <p className="text-xs text-slate-400">LLM Orchestration Specialist</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                        Senior AI engineer with extensive experience in LangChain, autonomous agents, and RAG architectures. Building the next generation of intelligent automation.
                                    </p>
                                    <div className="flex items-center justify-between text-sm py-3 border-t border-slate-800">
                                        <div className="flex items-center gap-1.5 text-slate-300">
                                            <Star className="h-4 w-4 fill-blue-400 text-blue-400" />
                                            <span className="font-bold">{courseData.rating}</span>
                                            <span className="text-slate-500">({courseData.students}+)</span>
                                        </div>
                                        <div className="text-slate-400">
                                            {courseData.duration} Content
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Prerequisites */}
                            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <Lightbulb className="h-5 w-5 text-yellow-400" />
                                    Prerequisites
                                </h3>
                                <ul className="space-y-3">
                                    {courseData.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm text-slate-400">
                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500/40 mt-1.5 flex-shrink-0" />
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
