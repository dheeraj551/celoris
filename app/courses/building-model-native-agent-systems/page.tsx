"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, Download, CheckCircle, HelpCircle, BookOpen, Zap, Eye, Lightbulb, Battery, Cpu, Radio, Shield, BarChart, Server, Workflow, Bot, Database, Search, Mail, Code, Terminal, MousePointer2, Layout, Music, Video, Mic, Image as ImageIcon, Brain, Network, Boxes, Activity, GitBranch, Layers, Trophy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { InteractiveQuiz } from "@/components/InteractiveQuiz"
import TestimonialsDisplay from "@/components/TestimonialsDisplay"

export default function BuildingModelNativeAgentSystemsCourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Building Model-Native Agent Systems (End-to-End)";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        const descriptionText = "Move from System-Centric orchestration to Model-Centric agency. Master internal planning, native tool-use, and persistent latent state for autonomous agents.";
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
        title: "Building Model-Native Agent Systems",
        subtitle: "(End-to-End)",
        description: "Unlearn the 'pipeline' mindset. This course transitions you from building systems that manage models to building models that manage systems. Learn to leverage 'Reasoning Models' to create truly autonomous, self-correcting agents that navigate complex goals without hard-coded logic.",
        students: 1240,
        rating: 4.99,
        duration: "8 Weeks (Accelerated)",
        price: 29999,
        currency: "INR",
        provider: "Celoris Designs",
        website: "https://www.celorisdesigns.com",
        url: "https://www.celorisdesigns.com/courses/building-model-native-agent-systems",
        learning_outcomes: [
            "Shift from Orchestration to Agency: Why external if/else loops fail at scale.",
            "Master Internal Planning: Moving from hard-coded graphs to dynamic latent-space navigation.",
            "Native Tool-Use: Teaching models to 'invent' API calls from documentation.",
            "Persistent Latent State: Building memory that evolves as the agent works.",
            "Fine-Tuning for Agency: 'Baking' reasoning traces into model weights via SFT and RLHF.",
            "Agentic Evals: Measuring trajectory success rates rather than just static benchmarks.",
            "Secure Sandboxing: Executing code in isolated environments with native trace debugging.",
            "Autonomous Discovery: Using MCP to connect agents to data sources autonomously.",
            "Long-Horizon Management: Handling token pressure and state across multi-hour runs.",
            "Distillation: Moving agentic power from frontier models to local, specialized models."
        ],
        requirements: [
            "Advanced Python proficiency",
            "Experience with LLM orchestration (LangChain/LlamaIndex)",
            "Basic understanding of Fine-tuning and RLHF",
            "Familiarity with Vector Databases and RAG"
        ],
        chapters: [
            {
                number: 1,
                title: "The Model-Native Paradigm Shift",
                icon: "Zap",
                topics: [
                    "From Orchestration to Agency: The limits of hard-coded pipelines.",
                    "Defining Model-Native: Reasoning models and internalized Chain-of-Thought.",
                    "The Stochastic OS: The LLM as the kernel of a new operating system.",
                    "Transitioning from System-Centric to Model-Centric design."
                ],
                duration: "1 Week"
            },
            {
                number: 2,
                title: "Architectural Deep-Dive — Internal Planning",
                icon: "GitBranch",
                topics: [
                    "Self-Generated Plans: Decomposing goals into DAGs on the fly.",
                    "Dynamic Re-routing: Identifying failure and 'hallucinating' fixes natively.",
                    "Advanced Patterns: Implementation of Reflexion and Self-Discovery.",
                    "Chain-of-Code: Teaching models to reason through execution."
                ],
                duration: "1.5 Weeks"
            },
            {
                number: 3,
                title: "Tool-Use as a Native Language",
                icon: "Boxes",
                topics: [
                    "Function Calling vs. API Synthesis: Inventing calls from documentation.",
                    "Model Context Protocol (MCP): Autonomous data source discovery.",
                    "Closing the Loop: Sandboxed execution and trace-based debugging.",
                    "Multi-hop tool interaction and error recovery."
                ],
                duration: "1 Week"
            },
            {
                number: 4,
                title: "Memory & Persistent Latent State",
                icon: "Database",
                topics: [
                    "Episodic vs. Semantic Memory: Remembering 'what worked'.",
                    "Long-Horizon Context: Managing token pressure in multi-hour runs.",
                    "Stateful Workflows: Using LangGraph or Agno for persistent state.",
                    "Dynamic RAG: Agent-driven retrieval strategies."
                ],
                duration: "1.5 Weeks"
            },
            {
                number: 5,
                title: "Fine-Tuning & Distillation for Agency",
                icon: "Radio",
                topics: [
                    "SFT for Reasoning: Creating datasets of thought traces.",
                    "RLHF & DPO: Reducing 'lazy agent' syndrome through feedback.",
                    "Model Distillation: Pushing agency into smaller local models (Llama/Mistral).",
                    "Continuous learning loops for specialized agent tasks."
                ],
                duration: "1.5 Weeks"
            },
            {
                number: 6,
                title: "Evaluations & The Agentic Stack",
                icon: "BarChart",
                topics: [
                    "Trajectory Evals: Grading steps, not just answers.",
                    "Stress Testing: Simulating API failures and corrupt data.",
                    "Human-in-the-loop (HITL): Building checkpoint and permission hooks.",
                    "The Production Stack: Modal, LangSmith, and Weights & Biases."
                ],
                duration: "1.5 Weeks"
            }
        ],
        faqs: [
            {
                question: "Is this course different from standard LangChain courses?",
                answer: "Yes. Traditional courses focus on 'chaining' prompts. This course focuses on 'agency'—building systems where the model determines the logic, plans its own steps, and recovers from errors autonomously."
            },
            {
                question: "Which models will we use?",
                answer: "We primarily work with reasoning models like OpenAI's o-series, Claude 3.5 Sonnet, and local models like Llama 3 for fine-tuning/distillation."
            },
            {
                question: "What is the high-level goal of the Capstone Project?",
                answer: "You will build an 'Autonomous Researcher' that can navigate a browser, bypass paywalls/404s, and produce verified reports with zero human intervention."
            },
            {
                question: "Do I need cloud credits for fine-tuning?",
                answer: "The course includes some compute credits for Modal and Lambda Labs, but for extremely large fine-tuning runs, additional credits may be needed."
            }
        ],
        projects: [
            {
                title: "The Autonomous Researcher",
                description: "A system that accepts multi-modal goals and navigates the web independently.",
                tools: "PydanticAI + Playwright + Claude 3.5",
                icon: "Bot"
            },
            {
                title: "Self-Healing DevOps Agent",
                description: "Monitors logs, identifies bugs, and autonomously submits PRs to fix them.",
                tools: "LangGraph + GitHub API + MCP",
                icon: "Shield"
            },
            {
                title: "Latent Memory Agent",
                description: "An agent that builds its own K-graph of experiences to optimize future tool choice.",
                tools: "Fine-tuned Llama + Neo4j + LangSmith",
                icon: "Database"
            }
        ],
        quiz_data: [
            {
                "title": "Core Philosophy & Mastery Framework",
                "questions": [
                    {
                        "question": "What is the fundamental shift described in a \"model-native\" system?",
                        "options": ["From human-in-the-loop to fully human-led", "From orchestration to agency", "From LLMs to small language models", "From Python to JavaScript"],
                        "correctIndex": 1
                    },
                    {
                        "question": "In a model-native world, the Large Language Model (LLM) is considered the:",
                        "options": ["User interface", "External plugin", "Kernel", "Database"],
                        "correctIndex": 2
                    },
                    {
                        "question": "Why do the sources suggest moving away from traditional \"if/else\" loops?",
                        "options": ["They are too fast for modern models", "They are too expensive to run", "They fail at scale in complex systems", "They require too much GPU memory"],
                        "correctIndex": 2
                    },
                    {
                        "question": "\"Native Tool-Use\" involves teaching models to:",
                        "options": ["Search Google manually", "'Invent' API calls directly from documentation", "Use only pre-coded Python scripts", "Rely on human prompts for tool selection"],
                        "correctIndex": 1
                    },
                    {
                        "question": "Which concept involves moving from hard-coded graphs to dynamic navigation?",
                        "options": ["Linear processing", "Latent-space navigation", "Vector database indexing", "Boolean logic gates"],
                        "correctIndex": 1
                    },
                    {
                        "question": "\"Persistent Latent State\" refers to building memory that:",
                        "options": ["Is cleared after every prompt", "Evolves as the agent works", "Is stored only in CSV files", "Cannot be modified once created"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What is \"baked\" into model weights during fine-tuning for agency?",
                        "options": ["Static facts", "Reasoning traces", "CSS styling", "HTML templates"],
                        "correctIndex": 1
                    },
                    {
                        "question": "How is success measured in model-native systems?",
                        "options": ["Static benchmarks", "Word count", "Trajectory success rates", "Latency only"],
                        "correctIndex": 2
                    },
                    {
                        "question": "What is the purpose of \"Distillation\" in this framework?",
                        "options": ["Making models larger", "Moving agentic power from frontier models to local, specialised models", "Deleting old data", "Converting Python to C++"],
                        "correctIndex": 1
                    },
                    {
                        "question": "\"Autonomous Discovery\" uses which protocol to connect to data sources?",
                        "options": ["HTTP/2", "MCP (Model Context Protocol)", "FTP", "SMTP"],
                        "correctIndex": 1
                    }
                ]
            },
            {
                "title": "The Agentic Stack & Infrastructure",
                "questions": [
                    {
                        "question": "Which framework is specifically mentioned for stateful multi-agent orchestration?",
                        "options": ["Django", "LangGraph", "Flask", "React"],
                        "correctIndex": 1
                    },
                    {
                        "question": "Which tool is recommended for handling structured data/validation in the stack?",
                        "options": ["PydanticAI", "NumPy", "Pandas", "Matplotlib"],
                        "correctIndex": 0
                    },
                    {
                        "question": "What does MCP stand for in the context of these sources?",
                        "options": ["Multi-Core Processing", "Model Context Protocol", "Main Control Program", "Model Command Power"],
                        "correctIndex": 1
                    },
                    {
                        "question": "Which companies are listed as providers for \"Compute\"?",
                        "options": ["AWS and Azure", "Modal and Lambda Labs", "Google Cloud and Oracle", "IBM and Intel"],
                        "correctIndex": 1
                    },
                    {
                        "question": "Which tools are used for \"Evaluations\" in the agentic stack?",
                        "options": ["Excel and Word", "LangSmith and W&B", "Pytest and Selenium", "Docker and Kubernetes"],
                        "correctIndex": 1
                    },
                    {
                        "question": "Secure Sandboxing is required to execute code in:",
                        "options": ["Public servers", "Isolated environments", "Shared databases", "Frontend browsers"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What challenge does \"Long-Horizon Management\" address?",
                        "options": ["Short Wi-Fi range", "Token pressure and state across multi-hour runs", "Fast cooling of GPUs", "Immediate response times"],
                        "correctIndex": 1
                    },
                    {
                        "question": "The \"Agentic Stack\" aims to handle what real-world phenomenon?",
                        "options": ["Binary code", "Entropy", "Static data", "Linear growth"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What type of models are used to navigate complex goals without hard-coded logic?",
                        "options": ["Image models", "Reasoning Models", "Audio models", "Translation models"],
                        "correctIndex": 1
                    },
                    {
                        "question": "Which evaluation platform is paired with Neo4j in the capstone projects?",
                        "options": ["W&B", "LangSmith", "GitHub", "Modal"],
                        "correctIndex": 1
                    }
                ]
            },
            {
                "title": "Capstone Projects & Practical Labs",
                "questions": [
                    {
                        "question": "The \"Autonomous Researcher\" system uses which specific model?",
                        "options": ["GPT-4", "Claude 3.5", "Gemini", "Mistral"],
                        "correctIndex": 1
                    },
                    {
                        "question": "Which tool is used by the Autonomous Researcher for web navigation?",
                        "options": ["BeautifulSoup", "Playwright", "Scrapy", "Selenium"],
                        "correctIndex": 1
                    },
                    {
                        "question": "The \"Self-Healing DevOps Agent\" primarily monitors:",
                        "options": ["User comments", "Logs and bugs", "Stock prices", "Social media trends"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What action does the DevOps agent take after identifying a bug?",
                        "options": ["Emails the manager", "Autonomously submits Pull Requests (PRs)", "Shuts down the server", "Deletes the repository"],
                        "correctIndex": 1
                    },
                    {
                        "question": "The Self-Healing DevOps agent utilizes which API?",
                        "options": ["Twitter API", "GitHub API", "Stripe API", "Google Maps API"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What does the \"Latent Memory Agent\" build to optimise tool choice?",
                        "options": ["A spreadsheet", "A K-graph (Knowledge Graph) of experiences", "A list of passwords", "A CSS stylesheet"],
                        "correctIndex": 1
                    },
                    {
                        "question": "Which database is used by the Latent Memory Agent?",
                        "options": ["PostgreSQL", "Neo4j", "MongoDB", "SQLite"],
                        "correctIndex": 1
                    },
                    {
                        "question": "Which base model is fine-tuned for the Latent Memory Agent?",
                        "options": ["BERT", "Llama", "T5", "RoBERTa"],
                        "correctIndex": 1
                    },
                    {
                        "question": "The Autonomous Researcher project is designed to handle:",
                        "options": ["Single-word prompts", "Multi-modal goals", "Offline data only", "Voice commands only"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What is the outcome of building with the \"grain of the model\"?",
                        "options": ["A simple script", "A production agent", "A basic prototype", "A static website"],
                        "correctIndex": 1
                    }
                ]
            },
            {
                "title": "Prerequisites & Course Details",
                "questions": [
                    {
                        "question": "What is the required level of Python proficiency for this course?",
                        "options": ["Beginner", "Intermediate", "Advanced"],
                        "correctIndex": 2
                    },
                    {
                        "question": "Experience with which specific orchestration tools is a prerequisite?",
                        "options": ["LangChain/LlamaIndex", "Django/Flask", "TensorFlow/Keras", "Spark/Hadoop"],
                        "correctIndex": 0
                    },
                    {
                        "question": "Students should have a basic understanding of which training methods?",
                        "options": ["Supervised learning only", "Fine-tuning and RLHF", "Unsupervised clustering", "Manual data entry"],
                        "correctIndex": 1
                    },
                    {
                        "question": "Familiarity with which data storage technology is required?",
                        "options": ["Flat files", "Vector Databases and RAG", "Tape drives", "Floppy disks"],
                        "correctIndex": 1
                    },
                    {
                        "question": "The course is described as an:",
                        "options": ["One-year degree", "8-week accelerated programme", "Weekend workshop", "Self-paced hobby course"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What is the rating listed for the \"Syncs\"?",
                        "options": ["3.5", "4.99", "4.0", "5.0"],
                        "correctIndex": 1
                    },
                    {
                        "question": "How many \"Syncs\" are mentioned in the course details?",
                        "options": ["100+", "1240+", "500", "10"],
                        "correctIndex": 1
                    },
                    {
                        "question": "Which organisation provides this training?",
                        "options": ["OpenAI", "Celoris Designs", "Anthropic", "DeepMind"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What certification is offered upon completion?",
                        "options": ["Python Developer", "Agentic Engineering Certification", "Web Designer", "Data Entry Specialist"],
                        "correctIndex": 1
                    },
                    {
                        "question": "The platform is described as a unified place for:",
                        "options": ["Gaming and movies", "Learning, earning, and engaging experiences", "Only corporate meetings", "Trading stocks"],
                        "correctIndex": 1
                    }
                ]
            },
            {
                "title": "Systems & Technical Specifics",
                "questions": [
                    {
                        "question": "What is the cost mentioned for \"Full Lifetime System Access\"?",
                        "options": ["₹ 5000", "₹ 29999", "₹ 9999", "Free"],
                        "correctIndex": 1
                    },
                    {
                        "question": "How many dollars in compute credits are included?",
                        "options": ["$100", "$500", "$1000", "$50"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What type of datasets are provided to students?",
                        "options": ["Random text", "Custom Reasoning Datasets", "Public weather data", "Image galleries"],
                        "correctIndex": 1
                    },
                    {
                        "question": "Which hub do students get private access to?",
                        "options": ["Docker Hub", "Private MCP Hub", "GitHub Public", "npm registry"],
                        "correctIndex": 1
                    },
                    {
                        "question": "Celoris Designs specialises in moving from traditional LLM apps to:",
                        "options": ["Basic chatbots", "Autonomous agentic systems", "Mobile games", "Hardware manufacturing"],
                        "correctIndex": 1
                    },
                    {
                        "question": "The \"Reasoning Traces\" are baked into weights via SFT and:",
                        "options": ["CNN", "RLHF", "GAN", "RNN"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What does the \"Agency Kernel\" help differentiate?",
                        "options": ["High and low cost", "Prototype and production", "Python and C++", "Front-end and back-end"],
                        "correctIndex": 1
                    },
                    {
                        "question": "Which of these is NOT part of the Agentic Stack listed?",
                        "options": ["PydanticAI", "Modal", "WordPress", "LangGraph"],
                        "correctIndex": 2
                    },
                    {
                        "question": "According to the sources, what is the copyright year?",
                        "options": ["2024", "2025", "2026", "2023"],
                        "correctIndex": 2
                    },
                    {
                        "question": "What is the primary goal of \"unlearning\" the pipeline mindset?",
                        "options": ["To stop using computers", "To build systems where models manage systems", "To go back to manual coding", "To simplify user interfaces"],
                        "correctIndex": 1
                    }
                ]
            }
        ],
        reviews: [
            {
                id: 'mna-rev-1',
                client_name: 'Arjun M.',
                client_title: 'Senior AI Engineer',
                client_avatar_url: null,
                testimonial_text: 'This course completely dismantled my LangChain-style thinking. The shift from orchestration to true agency finally clicked. Internal planning and latent state alone changed how I design every agent system now.',
                rating: 5,
                testimonial_type: 'general',
                client_company: null,
                client_location: null,
                client_website: null,
                date_received: null,
                is_featured: true,
                project_details: null
            },
            {
                id: 'mna-rev-2',
                client_name: 'Daniel K.',
                client_title: 'Applied Research Scientist',
                client_avatar_url: null,
                testimonial_text: 'I’ve read papers on reasoning models, but this is the first course that turns them into production architecture. Persistent latent state + agentic evals is a combination I hadn’t seen taught this clearly anywhere else.',
                rating: 5,
                testimonial_type: 'general',
                client_company: null,
                client_location: null,
                client_website: null,
                date_received: null,
                is_featured: true,
                project_details: null
            },
            {
                id: 'mna-rev-3',
                client_name: 'Priya S.',
                client_title: 'Startup CTO',
                client_avatar_url: null,
                testimonial_text: 'The “model is the kernel” idea sounded abstract—until Module 2. After that, it became obvious why my previous agents kept collapsing at scale. This course saved us months of architectural mistakes.',
                rating: 5,
                testimonial_type: 'general',
                client_company: null,
                client_location: null,
                client_website: null,
                date_received: null,
                is_featured: true,
                project_details: null
            },
            {
                id: 'mna-rev-4',
                client_name: 'Ethan W.',
                client_title: 'ML Engineer',
                client_avatar_url: null,
                testimonial_text: 'Not beginner-friendly, but extremely valuable. Tool-use as a native language was a breakthrough moment for me. Agents inventing API calls instead of following scripts feels like the future.',
                rating: 4,
                testimonial_type: 'general',
                client_company: null,
                client_location: null,
                client_website: null,
                date_received: null,
                is_featured: true,
                project_details: null
            },
            {
                id: 'mna-rev-5',
                client_name: 'Kunal R.',
                client_title: 'DevOps Lead',
                client_avatar_url: null,
                testimonial_text: 'The self-healing DevOps agent capstone is unreal. Watching an agent detect an error, reason about the fix, and submit a PR without brittle logic was a genuine “oh wow” moment.',
                rating: 5,
                testimonial_type: 'general',
                client_company: null,
                client_location: null,
                client_website: null,
                date_received: null,
                is_featured: true,
                project_details: null
            },
            {
                id: 'mna-rev-6',
                client_name: 'Sophia L.',
                client_title: 'AI Product Architect',
                client_avatar_url: null,
                testimonial_text: 'Most courses teach what agents do. This one teaches how they think. Long-horizon management and token pressure handling are rarely discussed but absolutely critical in real systems.',
                rating: 5,
                testimonial_type: 'general',
                client_company: null,
                client_location: null,
                client_website: null,
                date_received: null,
                is_featured: true,
                project_details: null
            },
            {
                id: 'mna-rev-7',
                client_name: 'Rahul T.',
                client_title: 'Indie AI Founder',
                client_avatar_url: null,
                testimonial_text: 'The distillation module alone paid for the course. Moving agentic behavior from frontier models into smaller local models is a game-changer for cost and control.',
                rating: 5,
                testimonial_type: 'general',
                client_company: null,
                client_location: null,
                client_website: null,
                date_received: null,
                is_featured: true,
                project_details: null
            },
            {
                id: 'mna-rev-8',
                client_name: 'Marcus B.',
                client_title: 'Platform Engineer',
                client_avatar_url: null,
                testimonial_text: 'This course assumes you already know your way around LLMs—and that’s exactly why it works. Secure sandboxing and trace-level debugging felt like graduate-level material.',
                rating: 4,
                testimonial_type: 'general',
                client_company: null,
                client_location: null,
                client_website: null,
                date_received: null,
                is_featured: true,
                project_details: null
            },
            {
                id: 'mna-rev-9',
                client_name: 'Nisha P.',
                client_title: 'AI Consultant',
                client_avatar_url: null,
                testimonial_text: 'Agentic evals were the missing piece for me. Measuring trajectory success instead of static benchmarks completely changed how I validate systems for clients.',
                rating: 5,
                testimonial_type: 'general',
                client_company: null,
                client_location: null,
                client_website: null,
                date_received: null,
                is_featured: true,
                project_details: null
            },
            {
                id: 'mna-rev-10',
                client_name: 'Oliver H.',
                client_title: 'Research Engineer',
                client_avatar_url: null,
                testimonial_text: 'This is not another LangChain tutorial. It’s a mental model upgrade. After finishing the course, pipeline-based agents feel obsolete. Model-native thinking is clearly where things are heading.',
                rating: 5,
                testimonial_type: 'general',
                client_company: null,
                client_location: null,
                client_website: null,
                date_received: null,
                is_featured: true,
                project_details: null
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Building Model-Native Agent Systems (End-to-End)",
        "description": "Master the shift from hard-coded AI pipelines to autonomous, model-native agency.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs",
            "sameAs": "https://www.celorisdesigns.com"
        },
        "educationalLevel": "Advanced",
        "teaches": [
            "Model-Native Agency",
            "Dynamic Planning",
            "MCP Protocol",
            "Agentic Fine-tuning",
            "Trajectory Evaluations",
            "Persistent Latent State"
        ]
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-8 selection:bg-emerald-500/30">
            {/* JSON-LD Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
                    <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-emerald-400 transition-colors">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-emerald-400 transition-colors">Courses</Link>
                    <span>/</span>
                    <span className="text-slate-100 line-clamp-1">{courseData.title}</span>
                </div>

                {/* Back Button */}
                <Link href="/learn/courses" className="inline-flex items-center text-slate-400 hover:text-emerald-400 mb-6 transition-all group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Course Header */}
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Model-Native</span>
                                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Agent Systems</span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Advanced AI</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                                {courseData.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-emerald-400/90 font-medium italic">
                                {courseData.subtitle}
                            </p>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
                                {courseData.description}
                            </p>
                        </div>

                        {/* Course Preview Image with Glassmorphism */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Card className="relative overflow-hidden border-0 bg-slate-900/50 backdrop-blur-xl rounded-2xl">
                                <div className="aspect-video relative overflow-hidden">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src="https://www.youtube.com/embed/MoZQeCYorns"
                                        title="Building Model-Native Agent Systems - Course Preview"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        className="w-full h-full"
                                    ></iframe>
                                </div>
                            </Card>
                        </div>

                        {/* Learning Outcomes */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-emerald-400" />
                                </div>
                                Mastery Framework
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courseData.learning_outcomes.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-emerald-500/30 transition-colors group">
                                        <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-emerald-500/20 transition-colors">
                                            <CheckCircle className="h-3 w-3 text-emerald-400" />
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
                                Curriculum Architecture
                            </h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {courseData.chapters.map((chapter, index) => {
                                    const Icon = chapter.icon === "Zap" ? Zap :
                                        chapter.icon === "GitBranch" ? GitBranch :
                                            chapter.icon === "Boxes" ? Boxes :
                                                chapter.icon === "Database" ? Database :
                                                    chapter.icon === "Radio" ? Radio : BarChart;
                                    return (
                                        <AccordionItem key={index} value={`chapter-${index}`} className="border border-slate-700/50 bg-slate-900/40 rounded-xl px-2 overflow-hidden">
                                            <AccordionTrigger className="hover:no-underline py-6">
                                                <div className="flex items-center gap-4 text-left w-full">
                                                    <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 shadow-inner">
                                                        <Icon className="h-6 w-6 text-emerald-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Module {chapter.number}</div>
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
                                                    <div className="h-px bg-gradient-to-r from-emerald-500/30 to-transparent mb-4"></div>
                                                    <ul className="grid grid-cols-1 gap-3">
                                                        {chapter.topics.map((topic, topicIndex) => (
                                                            <li key={topicIndex} className="flex items-start gap-3 text-slate-400 group">
                                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/40 mt-2 group-hover:bg-emerald-500 transition-colors" />
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

                        {/* Tech Stack Section */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <Cpu className="h-6 w-6 text-green-400" />
                                </div>
                                The Agentic Stack
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: "Frameworks", value: "LangGraph, PydanticAI" },
                                    { label: "Protocols", value: "MCP (Model Context)" },
                                    { label: "Compute", value: "Modal, Lambda Labs" },
                                    { label: "Evaluations", value: "LangSmith, W&B" }
                                ].map((item, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-slate-800/20 border border-slate-700/50">
                                        <div className="text-xs font-bold text-slate-500 uppercase mb-1">{item.label}</div>
                                        <div className="text-sm text-emerald-400 font-semibold">{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Projects Section */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Bot className="h-6 w-6 text-blue-400" />
                                </div>
                                Capstone & Lab Projects
                            </h2>
                            <p className="text-slate-400 mb-8">
                                Move beyond hello-world bots to production autonomous systems that handle real-world entropy.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {courseData.projects.map((item, index) => {
                                    const Icon = item.icon === "Bot" ? Bot : item.icon === "Shield" ? Shield : Database;
                                    return (
                                        <Card key={index} className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 hover:border-emerald-500/40 transition-all duration-300 group">
                                            <CardContent className="pt-8 text-center h-full flex flex-col">
                                                <div className="mx-auto bg-slate-700/50 p-4 w-fit rounded-2xl border border-slate-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                                    <Icon className="h-8 w-8 text-emerald-400" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                                <p className="text-sm text-slate-400 mb-4 flex-grow">{item.description}</p>
                                                <div className="text-xs font-mono bg-slate-950/50 p-2 rounded border border-slate-700 text-emerald-500">
                                                    {item.tools}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </section>

                        {/* Student Reviews Section */}
                        <section className="space-y-8">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-pink-500/20 rounded-lg">
                                    <Users className="h-6 w-6 text-pink-400" />
                                </div>
                                Student Transmissions (Reviews)
                            </h2>
                            <TestimonialsDisplay
                                initialTestimonials={courseData.reviews}
                                layout="grid"
                                limit={10}
                                showFeatured={false}
                                className="!grid-cols-1 md:!grid-cols-2"
                            />
                        </section>

                        {/* Why This Course Sells */}
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-cyan-600/10 border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <Brain className="h-24 w-24 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 relative z-10">The Agency Kernel</h3>
                            <p className="text-lg text-slate-300 leading-relaxed italic relative z-10">
                                \"In a model-native world, the LLM isn't a component; it's the kernel. Learning to build with the grain of the model's reasoning capabilities is the difference between a prototype and a production agent.\"
                            </p>
                        </div>

                        {/* FAQ Section */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-orange-500/20 rounded-lg">
                                    <HelpCircle className="h-6 w-6 text-orange-400" />
                                </div>
                                System Inquiries (FAQ)
                            </h2>
                            <Accordion type="single" collapsible className="w-full space-y-2">
                                {courseData.faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`faq-${index}`} className="border-slate-800">
                                        <AccordionTrigger className="text-slate-200 hover:text-white transition-colors text-left font-medium">{faq.question}</AccordionTrigger>
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
                                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                                        <Trophy className="h-6 w-6 text-emerald-400" />
                                    </div>
                                    Mastery Assessment: Model-Native Agent Systems
                                </h2>
                                <p className="text-slate-400 mt-2">Validate your expertise in reasoning models, latent-space navigation, and autonomous agent architectures.</p>
                            </div>
                            <InteractiveQuiz
                                quizTitle="Model-Native Agent Systems Mastery Assessment"
                                quizDescription="50 questions covering the core philosophy, technical stack, and capstone projects of model-native engineering."
                                quizUnits={courseData.quiz_data}
                                onCompleteMessage={(score) => {
                                    if (score >= 45) return "Architect Level! You have mastered the model-native paradigm and are ready to build production agents.";
                                    if (score >= 35) return "Engineering Ready! You have a strong grasp of latent-space navigation and autonomous discovery.";
                                    return "Keep Building! Review the internal planning and persistent state modules to strengthen your agency skills.";
                                }}
                            />
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-8">
                            {/* Enrollment Card */}
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                <Card className="relative bg-slate-900 border-0 rounded-3xl overflow-hidden shadow-2xl">
                                    <CardContent className="p-8">
                                        <div className="text-center mb-8">
                                            <div className="text-5xl font-extrabold text-white mb-2 tracking-tighter">
                                                ₹{courseData.price}
                                            </div>
                                            <div className="text-emerald-400 font-bold tracking-widest uppercase text-xs">Full Lifetime System Access</div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <CourseInquiryDialog
                                                courseTitle={courseData.title}
                                                buttonClassName="w-full h-14 text-lg font-bold bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white rounded-2xl shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
                                            />
                                            <Button
                                                variant="outline"
                                                className="w-full h-12 border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl flex items-center justify-center gap-2 group transition-all"
                                                onClick={() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })}
                                            >
                                                <Trophy className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                                                Take Mastery Quiz
                                            </Button>
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-slate-800">
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Award className="h-5 w-5 text-emerald-400" />
                                                <span>Agentic Engineering Certification</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Cpu className="h-5 w-5 text-purple-400" />
                                                <span>Custom Reasoning Datasets</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Network className="h-5 w-5 text-blue-400" />
                                                <span>Private MCP Hub Access</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Zap className="h-5 w-5 text-orange-400" />
                                                <span>$500 Compute Credits included</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Instructor Card */}
                            <Card className="bg-slate-900/50 backdrop-blur-md border-slate-700/50 rounded-2xl overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Protocol Lead</div>
                                    <CardTitle className="text-xl text-white">Celoris Designs</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white p-2.5 shadow-lg shadow-white/10 border border-slate-200 flex items-center justify-center">
                                            <img src="/celoris-logo.png" alt="Celoris" className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">Celoris Designs</h4>
                                            <p className="text-xs text-slate-400">Pioneering Model-Native Architecture</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                        Leading the transition from traditional LLM apps to autonomous agentic systems. We specialize in reasoning models, persistent latent state, and model-native discovery protocols.
                                    </p>
                                    <div className="flex items-center justify-between text-sm py-3 border-t border-slate-800">
                                        <div className="flex items-center gap-1.5 text-slate-300">
                                            <Star className="h-4 w-4 fill-emerald-400 text-emerald-400" />
                                            <span className="font-bold">{courseData.rating}</span>
                                            <span className="text-slate-500">({courseData.students}+ Syncs)</span>
                                        </div>
                                        <div className="text-slate-400">
                                            {courseData.duration}
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
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/40 mt-1.5 flex-shrink-0" />
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
