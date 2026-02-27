"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, Download, CheckCircle, HelpCircle, BookOpen, Zap, Eye, Lightbulb, Battery, Cpu, Radio, Shield, BarChart, Server, Workflow, Bot, Database, Search, Mail, Code, Terminal, MousePointer2, Layout, Music, Video, Mic, Image as ImageIcon, Trophy } from "lucide-react"
import { InteractiveQuiz } from "@/components/InteractiveQuiz"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"

export default function MasteringMultimodalAICourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Mastering Multimodal AI: Engineering Vision, Audio, and Language Fusion Systems";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        const descriptionText = "Transition from LLM-centric thinking to Large Multimodal Model (LMM) engineering. Learn to align pixels, waveforms, and tokens into a shared latent space. Free to start. No credit card. celoris.in 🇮🇳";
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
        title: "Mastering Multimodal AI",
        subtitle: "Engineering Vision, Audio, and Language Fusion Systems",
        description: "This course transitions students from LLM-centric thinking to Large Multimodal Model (LMM) engineering. Participants will learn to align different data distributions (pixels, waveforms, and tokens) into a shared latent space to build 'eyes, ears, and voices' for their AI applications.",
        students: 1850,
        rating: 4.98,
        duration: "8-10 Weeks (Self-paced)",
        price: 24999,
        currency: "INR",
        provider: "Celoris Designs",
        website: "https://www.celorisdesigns.com",
        url: "https://www.celorisdesigns.com/courses/mastering-multimodal-ai",
        learning_outcomes: [
            "Understand the Alignment Problem: Why concatenation fails image/text vectors.",
            "Master Contrastive Learning and deep dive into CLIP architecture.",
            "Implement Joint vs. Coordinated Representations in n-dimensional space.",
            "Build systems using Vision Transformers (ViT) and Projection Layers.",
            "Fine-tune LMMs like BLIP-2, Flamingo, and LLaVA on custom datasets.",
            "Integrate Audio & Speech: Raw audio vs. spectrogram representations.",
            "Explore the 'Omni' Trend: Native audio tokens without text transcription.",
            "Implement Early, Late, and Cross-attention fusion strategies.",
            "Build Multimodal RAG systems using LanceDB and Milvus.",
            "Optimize and deploy heavy multimodal pipelines in production."
        ],
        requirements: [
            "Strong proficiency in Python and PyTorch",
            "Deep understanding of Transformer architectures",
            "Familiarity with Hugging Face ecosystem",
            "Experience with Vector Databases is recommended"
        ],
        chapters: [
            {
                number: 1,
                title: "Foundations of Multimodal Latent Spaces",
                icon: "Zap",
                topics: [
                    "The Alignment Problem: Why we can't just 'concatenate' image and text vectors.",
                    "Contrastive Learning: Deep dive into CLIP (Contrastive Language-Image Pre-training).",
                    "Joint vs. Coordinated Representations: Mapping different modalities into one space.",
                    "Hands-on: Visualizing image and text clusters using UMAP/t-SNE."
                ],
                videoUrl: "https://www.youtube.com/embed/VUTgjCNI4m0",
                duration: "1.5 Weeks"
            },
            {
                number: 2,
                title: "Vision + Language (The VLM Era)",
                icon: "ImageIcon",
                topics: [
                    "Vision Transformers (ViT): Moving beyond CNNs for multimodal backbones.",
                    "Bridging the Gap: Projection Layers and Q-Formers (BLIP-2, Flamingo).",
                    "Visual Question Answering (VQA): Building reasoning systems for images.",
                    "Hands-on: Fine-tuning a LLaVA-style model on a custom domain dataset."
                ],
                duration: "2 Weeks"
            },
            {
                number: 3,
                title: "Audio & Speech Integration",
                icon: "Mic",
                topics: [
                    "Beyond ASR: Understanding raw audio vs. spectrogram representations.",
                    "Audio-Text Alignment: Exploring Wav2Vec 2.0 and CLAP.",
                    "The 'Omni' Trend: Handling native audio tokens (GPT-4o style).",
                    "Hands-on: Building a 'Sentiment-to-Music' generator or voice-command interface."
                ],
                duration: "2 Weeks"
            },
            {
                number: 4,
                title: "Advanced Fusion & Temporal Data",
                icon: "Video",
                topics: [
                    "Fusion Strategies: Early fusion vs. Late fusion vs. Cross-attention.",
                    "Handling Time: Processing video frames and sensor time-series data.",
                    "Sensor Fusion: Integrating IMU/GPS with visual streams for robotics.",
                    "Mathematical Concept: The Fusion Equation Z = f(WᵥV, WₐA, WₜT) representing Vision, Audio, and Text embeddings."
                ],
                duration: "2 Weeks"
            },
            {
                number: 5,
                title: "Multimodal RAG & Production",
                icon: "Database",
                topics: [
                    "Multimodal Vector DBs: Using LanceDB or Milvus for image/audio retrieval.",
                    "Inference Optimization: Quantization and distillation for LMMs.",
                    "Evaluation: Measuring 'correctness' for complex multimodal outputs.",
                    "Hands-on: Building a 'Multimodal Second Brain' for videos, notes, and voice."
                ],
                duration: "2 Weeks"
            }
        ],
        faqs: [
            {
                question: "Do I need a GPU to take this course?",
                answer: "Yes, a modern GPU (like NVIDIA RTX series or cloud GPUs on Colab/Lambda) is highly recommended for the hands-on fine-tuning and inference projects."
            },
            {
                question: "Is this course for beginners?",
                answer: "No, this is an advanced engineering course. You should be comfortable with PyTorch and standard LLM architectures before enrolling."
            },
            {
                question: "Will we cover GPT-4o and Gemini 1.5 Pro?",
                answer: "We cover the architectural principles behind these models, including native tokenization and unified decoders, and how to build open-source equivalents."
            },
            {
                question: "What frameworks will we use?",
                answer: "The primary stack is PyTorch and Hugging Face Transformers. We also use LanceDB for vector storage and Triton for deployment."
            }
        ],
        projects: [
            {
                title: "The Interactive Concierge",
                description: "A video-audio-text agent that sees, hears, and responds contextually.",
                tools: "LLaVA-v1.6 + Whisper + Bark",
                icon: "Bot"
            },
            {
                title: "Multimodal Security Auditor",
                description: "Correlates CCTV footage with audio triggers like breaking glass.",
                tools: "CLIP + CLAP + Milvus",
                icon: "Shield"
            },
            {
                title: "Medical Diagnostic Aid",
                description: "Fuses X-ray imagery with patient history and doctor's voice notes.",
                tools: "BioViL + Med-PALM 2 Principles",
                icon: "Database"
            }
        ],
        quiz_data: [
            {
                title: "Foundations & MLLM Architecture",
                questions: [
                    {
                        question: "What are the three core modules of a typical Multimodal Large Language Model (MLLM)?",
                        options: ["Encoder, Transformer, and Decoder", "Modality encoder, pre-trained LLM, and modality interface", "Vision model, Audio model, and Text model", "Input layer, Hidden layer, and Output layer"],
                        correctIndex: 1
                    },
                    {
                        question: "In the context of MLLMs, the modality interface is responsible for what task?",
                        options: ["Compressing raw information into compact representations", "Bridging the gap and aligning different modalities", "Storing world knowledge", "Generating multi-round conversations"],
                        correctIndex: 1
                    },
                    {
                        question: "Which model is a representative of the discriminative paradigm in multimodality?",
                        options: ["CLIP", "OFA", "GPT-4V", "LLaVA"],
                        correctIndex: 0
                    },
                    {
                        question: "What is referred to as the 'brain' of an MLLM?",
                        options: ["The Modality Encoder", "The Modality Interface", "The Large Language Model (LLM)", "The Generator"],
                        correctIndex: 2
                    },
                    {
                        question: "Which trait distinguishes MLLMs from traditional multimodal models?",
                        options: ["Use of small-scale datasets", "Billion-scale parameters and new training paradigms like instruction tuning", "Reliance on rule-based systems", "Lack of reasoning capabilities"],
                        correctIndex: 1
                    },
                    {
                        question: "What surprising emergent capability is rare in traditional multimodal methods but present in MLLMs?",
                        options: ["Simple image classification", "OCR-free math reasoning", "Basic text summarisation", "Voice recording"],
                        correctIndex: 1
                    },
                    {
                        question: "Which type of connector enables feature-level fusion inside the LLM?",
                        options: ["Projection-based connectors", "Query-based connectors", "Fusion-based connectors", "MLP-based interfaces"],
                        correctIndex: 2
                    },
                    {
                        question: "The Q-Former style approach is an example of what interface type?",
                        options: ["Query-based learnable connector", "Expert model translation", "Linear projection", "Encoder-free architecture"],
                        correctIndex: 0
                    },
                    {
                        question: "How does Flamingo integrate visual information into its language model?",
                        options: ["Via a linear MLP", "Inserting extra cross-attention layers between frozen Transformer layers", "Directly concatenating raw pixels to text tokens", "Using a bilingual Qwen base"],
                        correctIndex: 1
                    },
                    {
                        question: "Which model supports flexible image resolution by directly projecting image patches?",
                        options: ["MiniGPT-4", "Fuyu-8b", "InstructBLIP", "Qwen-VL"],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Training Stage & Data Alignment",
                questions: [
                    {
                        question: "What is the primary objective of the pre-training stage in MLLM training?",
                        options: ["Aligning models with human preferences", "Aligning different modalities and learning multimodal world knowledge", "Reducing hallucinations via RLHF", "Improving multi-round conversation skills"],
                        correctIndex: 1
                    },
                    {
                        question: "Pre-training data typically consists of which of the following?",
                        options: ["Large-scale text-paired data, such as image-caption pairs", "Hand-crafted demonstrations", "Human preference labels", "Negative instructions only"],
                        correctIndex: 0
                    },
                    {
                        question: "What does instruction tuning aim to teach MLLMs?",
                        options: ["To predict the next word in a sentence", "To better understand user instructions and generalise to unseen tasks", "To align with specific human ethical values", "To compress audio signals into spectrograms"],
                        correctIndex: 1
                    },
                    {
                        question: "LLaVA-Instruct-150k was primarily constructed using which data collection method?",
                        options: ["Data Adaptation", "Self-Instruction using GPT-4", "Data Mixture", "Manual annotation by medical experts"],
                        correctIndex: 1
                    },
                    {
                        question: "Which alignment technique simplifies the pipeline by learning from preference labels using a binary classification loss?",
                        options: ["RLHF", "PPO", "DPO (Direct Preference Optimization)", "Supervised Fine-Tuning"],
                        correctIndex: 2
                    },
                    {
                        question: "What is the core mechanism of Reinforcement Learning with Human Feedback (RLHF)?",
                        options: ["Utilising reinforcement learning to align LLMs with human preferences via a reward model", "Training a model to predict image captions from scratch", "Reducing the number of parameters in a model", "Using expert models to translate images into text"],
                        correctIndex: 0
                    },
                    {
                        question: "Which dataset is a research-purpose multilingual dataset containing 5.85B image-text pairs?",
                        options: ["CC-3M", "SBU Captions", "LAION-5B", "COYO-700M"],
                        correctIndex: 2
                    },
                    {
                        question: "What is a common trait of coarse-grained web-scrawled caption data?",
                        options: ["They are long and accurate", "They are usually short and noisy as they originate from alt-text", "they are manually verified by experts", "they are exclusively in Chinese"],
                        correctIndex: 1
                    },
                    {
                        question: "In MLLM evaluation, what do 'closed-set' questions refer to?",
                        options: ["Questions with arbitrary, flexible responses", "Questions where answer options are predefined and limited", "Internal model weights testing", "Questions that only a chatbot can answer"],
                        correctIndex: 1
                    },
                    {
                        question: "What does the MME benchmark specifically evaluate in MLLMs?",
                        options: ["Only text generation speed", "14 perception and cognition tasks using manually designed pairs", "The number of parameters in the encoder", "The ethical bias of the model"],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Agentic AI & Advanced Interaction",
                questions: [
                    {
                        question: "Define 'Agentic AI' according to the latest technology trends.",
                        options: ["A model that only generates text responses", "A system capable of independently planning and executing complex, multistep tasks", "A chatbot designed for single-turn conversations", "A static knowledge database"],
                        correctIndex: 1
                    },
                    {
                        question: "What shift is described by the term 'model-native agent system'?",
                        options: ["From cloud computing to edge computing", "From rigid pipelines to kernels where the LLM is the core operating system", "From multimodal inputs to text-only outputs", "From human leadership to complete AI governance"],
                        correctIndex: 1
                    },
                    {
                        question: "The 'Silent Guardian' bot, an agentic system for cybersecurity, uses which framework?",
                        options: ["AutoGen", "CrewAI", "LangGraph", "PyTorch"],
                        correctIndex: 2
                    },
                    {
                        question: "What is a primary goal of transitioning to an Agentic Security Operations Centre (SOC)?",
                        options: ["Increasing the cost of security software", "Reducing 'Tier 1 burnout' by delegating routine triage and investigation to agents", "Removing humans from the decision-making loop entirely", "Building larger databases for static signatures"],
                        correctIndex: 1
                    },
                    {
                        question: "Which framework is specifically mentioned for building 'Swarms' of investigation agents?",
                        options: ["CrewAI", "Stable Diffusion", "TensorFlow", "OpenCV"],
                        correctIndex: 0
                    },
                    {
                        question: "What does a 'self-healing DevOps agent' do?",
                        options: ["Alerts humans when a server is down", "Diagnoses bugs, writes code to fix them, and submits fixes for review", "Deletes all files when a vulnerability is found", "Predicts future market trends for software"],
                        correctIndex: 1
                    },
                    {
                        question: "What is the enterprise adoption score for Agentic AI in 2025?",
                        options: ["1—Frontier Innovation", "2—Experimentation", "4—Scaling in Progress", "5—Fully Scaled"],
                        correctIndex: 2
                    },
                    {
                        question: "How does 'Agency' differ from 'Orchestration' in AI systems?",
                        options: ["Agency is more brittle and rigid", "Agency is dynamic, makes plans as it goes, and acts as the system itself", "Orchestration allows for real-world entropy", "Orchestration treats the model as the kernel"],
                        correctIndex: 1
                    },
                    {
                        question: "What is 'Native Tool Use' in the context of model-native agents?",
                        options: ["Hard-coding every API call", "The ability of agents to read documentation and teach themselves how to use new tools", "Relying on human developers to script every action", "Using only one specific search engine"],
                        correctIndex: 1
                    },
                    {
                        question: "Which protocol was introduced to standardize data sharing between AI models and external tools?",
                        options: ["A2A", "Model Context Protocol (MCP)", "HTTP/3", "TCP/IP"],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Gradient Modulation & Modality Synergy",
                questions: [
                    {
                        question: "What phenomenon does Adaptive Gradient Modulation (AGM) aim to address?",
                        options: ["Data leakage", "Sub-optimal performance caused by 'modality competition'", "The high cost of GPU training", "Slow inference speeds in mobile devices"],
                        correctIndex: 1
                    },
                    {
                        question: "What is 'modality competition' in joint training?",
                        options: ["Modalities working together to improve accuracy", "The existence of a dominant modality that prevents the model from exploiting others", "A marketing term for different AI companies", "The process of choosing between vision or audio encoders"],
                        correctIndex: 1
                    },
                    {
                        question: "How does AGM compute mono-modal responses to modulate training?",
                        options: ["Using a simple linear regression", "Utilising a Shapley value-based attribution technique", "By turning off the LLM during training", "Manually weighting the visual encoder at 90%"],
                        correctIndex: 1
                    },
                    {
                        question: "What does the 'mono-modal concept' represent?",
                        options: ["The model's performance on text-only tasks", "The competition-less state of a modality within a multimodal model", "A model trained on a single dataset", "The average of all modality encoders"],
                        correctIndex: 1
                    },
                    {
                        question: "Which multimodal interaction occurs when both modalities are needed simultaneously to fulfil a task?",
                        options: ["Redundancy", "Uniqueness", "Synergy", "Competition"],
                        correctIndex: 2
                    },
                    {
                        question: "'Redundancy' in multimodal learning means what?",
                        options: ["One modality contains no useful information", "The task can be performed using either modality because they contain the same information", "The model has too many parameters", "The dataset is a duplicate of another"],
                        correctIndex: 1
                    },
                    {
                        question: "What does CoMM stand for in the context of multimodal learning?",
                        options: ["Collaborative Multimodal Management", "Contrastive MultiModal learning", "Computational Modality Modulation", "Causal Model Multimodality"],
                        correctIndex: 0
                    },
                    {
                        question: "CoMM's formulation is aligned with which theory in cognitive neuroscience?",
                        options: ["Theory of Mind", "Global Workspace Theory", "Neural Plasticity", "Selective Attention Theory"],
                        correctIndex: 1
                    },
                    {
                        question: "Multimodal In-Context Learning (M-ICL) differs from supervised learning because its crux is to:",
                        options: ["Learn implicit patterns from millions of samples", "Learn from analogy using a few examples and instructions", "Update model weights at every inference step", "Use a reward model to score answers"],
                        correctIndex: 1
                    },
                    {
                        question: "Reasoning chains in Multimodal Chain of Thought (M-CoT) can be structured as:",
                        options: ["Only single-step", "Single-chain or tree-shape", "Circular or linear", "Text-only or image-only"],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Hallucinations, Security & Metrics",
                questions: [
                    {
                        question: "What is a 'Multimodal Hallucination'?",
                        options: ["A visual glitch in the user interface", "Responses generated by MLLMs that are inconsistent with image content", "The model refusing to answer a prompt", "The model generating text in a foreign language"],
                        correctIndex: 1
                    },
                    {
                        question: "Which hallucination type involves false descriptions of relative positions or interactions between objects?",
                        options: ["Existence Hallucination", "Attribute Hallucination", "Relationship Hallucination", "Linguistic Hallucination"],
                        correctIndex: 2
                    },
                    {
                        question: "Which early metric measures the proportion of sentences with hallucinated objects in captions?",
                        options: ["CHAIR", "POPE", "MME", "BLEU"],
                        correctIndex: 0
                    },
                    {
                        question: "The 'Amplify-then-contrast' decoding scheme (VCD) is designed to offset what?",
                        options: ["High training costs", "False bias caused by statistical bias in training data or language priors", "Low resolution of input images", "Slow response times in chatbots"],
                        correctIndex: 1
                    },
                    {
                        question: "What is 'steganographic collusion' in multi-agent security?",
                        options: ["Agents sharing passwords in plain text", "Agents learning to embed hidden messages in natural language to evade oversight", "A bug that causes models to stop working", "Humans tricking AI into leaking data"],
                        correctIndex: 1
                    },
                    {
                        question: "Define a 'Swarm attack' in the context of AI agents.",
                        options: ["One powerful agent attacking a database", "Coordinated fleets of agents combining resources to overwhelm targets", "A model generating too many emails", "A virus that affects only robotics foundation models"],
                        correctIndex: 1
                    },
                    {
                        question: "What is 'LLM Vaccination'?",
                        options: ["Installing antivirus software on a GPU", "Seeding an agent's memory with examples of safely handling malicious prompts", "Fine-tuning a model on medical data", "Restricting a model's access to the internet"],
                        correctIndex: 1
                    },
                    {
                        question: "Why are 'edge of chaos' dynamics significant for decentralized AI?",
                        options: ["Represent a state where the system is completely broken", "Believed to be a pre-condition for the emergence of distributed intelligence", "Refer to the physical edge of a data centre", "Type of cybersecurity firewall"],
                        correctIndex: 1
                    },
                    {
                        question: "What is a 'Heterogeneous attack'?",
                        options: ["Attacking models of different sizes", "Combining multiple 'safe' agents with complementary skills to execute a complex exploit", "Using text to attack a vision model", "A single agent using multiple languages"],
                        correctIndex: 1
                    },
                    {
                        question: "Which method mitigates hallucinations in a 'post-remedy' way after output generation?",
                        options: ["LRV-Instruction", "Woodpecker", "HACL", "HallE-Switch"],
                        correctIndex: 1
                    }
                ]
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Mastering Multimodal AI",
        "description": "Engineering Vision, Audio, and Language Fusion Systems. Move beyond text-only AI.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs",
            "sameAs": "https://www.celorisdesigns.com"
        },
        "educationalLevel": "Advanced",
        "teaches": [
            "Multimodal Alignment",
            "Contrastive Learning (CLIP)",
            "Vision Transformers (ViT)",
            "Audio-Text Integration",
            "Multimodal RAG",
            "Late/Early Fusion Strategies"
        ]
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-8 selection:bg-cyan-500/30">
            {/* JSON-LD Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
                    <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-cyan-400 transition-colors">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-cyan-400 transition-colors">Courses</Link>
                    <span>/</span>
                    <span className="text-slate-100 line-clamp-1">{courseData.title}</span>
                </div>

                {/* Back Button */}
                <Link href="/learn/courses" className="inline-flex items-center text-slate-400 hover:text-cyan-400 mb-6 transition-all group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Course Header */}
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Multimodal AI</span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Computer Vision</span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Audio Engineering</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                                {courseData.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-cyan-400/90 font-medium">
                                {courseData.subtitle}
                            </p>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
                                {courseData.description}
                            </p>
                        </div>

                        {/* Course Preview Video with Glassmorphism */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Card className="relative overflow-hidden border-0 bg-slate-900/50 backdrop-blur-xl rounded-2xl">
                                <div className="aspect-video relative overflow-hidden">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src="https://www.youtube.com/embed/G_eFurGI3Go?rel=0"
                                        title="Mastering Multimodal AI Course Preview"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        className="absolute inset-0 w-full h-full"
                                    ></iframe>
                                </div>
                            </Card>
                        </div>

                        {/* Core Promise / Learning Outcomes */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-cyan-500/20 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-cyan-400" />
                                </div>
                                What You Will Master
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courseData.learning_outcomes.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-cyan-500/30 transition-colors group">
                                        <div className="h-5 w-5 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-cyan-500/20 transition-colors">
                                            <CheckCircle className="h-3 w-3 text-cyan-400" />
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
                                    const Icon = chapter.icon === "Zap" ? Zap :
                                        chapter.icon === "ImageIcon" ? ImageIcon :
                                            chapter.icon === "Mic" ? Mic :
                                                chapter.icon === "Video" ? Video : Database;
                                    return (
                                        <AccordionItem key={index} value={`chapter-${index}`} className="border border-slate-700/50 bg-slate-900/40 rounded-xl px-2 overflow-hidden">
                                            <AccordionTrigger className="hover:no-underline py-6">
                                                <div className="flex items-center gap-4 text-left w-full">
                                                    <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 shadow-inner">
                                                        <Icon className="h-6 w-6 text-cyan-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-1">Module {chapter.number}</div>
                                                        <div className="text-lg font-semibold text-white">{chapter.title}</div>
                                                    </div>
                                                    <div className="hidden sm:flex items-center gap-2 text-slate-400 text-sm mr-4 bg-slate-800/50 px-3 py-1 rounded-full text-nowrap">
                                                        <Clock className="h-4 w-4" />
                                                        {chapter.duration}
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-6 px-4">
                                                <div className="pl-14 space-y-6">
                                                    <div className="h-px bg-gradient-to-r from-cyan-500/30 to-transparent mb-4"></div>

                                                    {chapter.videoUrl && (
                                                        <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-700/50 mb-6 bg-slate-950">
                                                            <iframe
                                                                width="100%"
                                                                height="100%"
                                                                src={chapter.videoUrl}
                                                                title={`${chapter.title} Video`}
                                                                frameBorder="0"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                                allowFullScreen
                                                                className="absolute inset-0 w-full h-full"
                                                            ></iframe>
                                                        </div>
                                                    )}

                                                    <ul className="grid grid-cols-1 gap-3">
                                                        {chapter.topics.map((topic, topicIndex) => (
                                                            <li key={topicIndex} className="flex items-start gap-3 text-slate-400 group">
                                                                <div className="h-1.5 w-1.5 rounded-full bg-cyan-500/40 mt-2 group-hover:bg-cyan-500 transition-colors" />
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
                                The Engineering Stack
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: "Frameworks", value: "PyTorch, Hugging Face" },
                                    { label: "Models", value: "CLIP, Whisper, LLaVA" },
                                    { label: "Vector Search", value: "Qdrant, Milvus, LanceDB" },
                                    { label: "Deployment", value: "NVIDIA Triton, vLLM" }
                                ].map((item, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-slate-800/20 border border-slate-700/50">
                                        <div className="text-xs font-bold text-slate-500 uppercase mb-1">{item.label}</div>
                                        <div className="text-sm text-cyan-400 font-semibold">{item.value}</div>
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
                                Multimodal Engineering Projects
                            </h2>
                            <p className="text-slate-400 mb-8">
                                Practical, production-grade projects designed to benchmark your mastery of LMM engineering.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {courseData.projects.map((item, index) => {
                                    const Icon = item.icon === "Bot" ? Bot : item.icon === "Shield" ? Shield : Database;
                                    return (
                                        <Card key={index} className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 hover:border-cyan-500/40 transition-all duration-300 group">
                                            <CardContent className="pt-8 text-center h-full flex flex-col">
                                                <div className="mx-auto bg-slate-700/50 p-4 w-fit rounded-2xl border border-slate-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                                    <Icon className="h-8 w-8 text-cyan-400" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                                <p className="text-sm text-slate-400 mb-4 flex-grow">{item.description}</p>
                                                <div className="text-xs font-mono bg-slate-950/50 p-2 rounded border border-slate-700 text-cyan-500">
                                                    {item.tools}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </section>

                        {/* Why This Course Sells */}
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <Zap className="h-24 w-24 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 relative z-10">The Multimodal Shift</h3>
                            <p className="text-lg text-slate-300 leading-relaxed italic relative z-10">
                                "The next generation of AI won't just 'read' the world; it will perceive it. Mastering the fusion of vision, audio, and language is the key to building truly autonomous systems."
                            </p>
                        </div>

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
                                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                                        <Trophy className="h-6 w-6 text-cyan-400" />
                                    </div>
                                    Mastery Assessment: Multimodal AI & Agentic Systems
                                </h2>
                                <p className="text-slate-400 mt-2">Validate your expertise in MLLM architectures, modality alignment, and agentic AI security.</p>
                            </div>
                            <InteractiveQuiz
                                quizTitle="Multimodal AI Mastery Assessment"
                                quizDescription="50 comprehensive questions covering MLLM modules, training stages, modality competition, and agentic security."
                                quizUnits={courseData.quiz_data}
                                onCompleteMessage={(score) => {
                                    if (score >= 45) return "Multimodal Expert Grade! Your understanding of alignment, fusion, and agentic intelligence is exceptional. You're ready to engineer the next generation of 'seeing and hearing' AI.";
                                    if (score >= 35) return "LMM Engineer! You have a solid grasp of multimodal concepts. Focus on refining your understanding of modality competition and synergy.";
                                    return "Good attempt! Review the modules on MLLM architecture and adaptive gradient modulation to strengthen your foundational knowledge.";
                                }}
                            />
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-8">
                            {/* Enrollment Card */}
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                <Card className="relative bg-slate-900 border-0 rounded-3xl overflow-hidden shadow-2xl">
                                    <CardContent className="p-8">
                                        <div className="text-center mb-8">
                                            
                                            <div className="text-cyan-400 font-bold tracking-widest uppercase text-xs">Full Lifetime Access</div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <CourseInquiryDialog
                                                courseTitle={courseData.title}
                                                buttonClassName="w-full h-14 text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-2xl shadow-lg shadow-cyan-500/25 transition-all active:scale-95"
                                            />
                                            <Button
                                                variant="outline"
                                                className="w-full h-12 border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl flex items-center justify-center gap-2 group transition-all"
                                                onClick={() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })}
                                            >
                                                <Trophy className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                                                Take Mastery Quiz
                                            </Button>
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-slate-800">
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Award className="h-5 w-5 text-cyan-400" />
                                                <span>Professional Certification</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Cpu className="h-5 w-5 text-purple-400" />
                                                <span>LMM Fine-tuning Workbench</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Users className="h-5 w-5 text-blue-400" />
                                                <span>AI Engineering Community</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Zap className="h-5 w-5 text-orange-400" />
                                                <span>Compute Credits Included</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Instructor Card */}
                            <Card className="bg-slate-900/50 backdrop-blur-md border-slate-700/50 rounded-2xl overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Instructor</div>
                                    <CardTitle className="text-xl text-white">Celoris Designs</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white p-2.5 shadow-lg shadow-white/10 border border-slate-200 flex items-center justify-center">
                                            <img src="/celoris-logo.png" alt="Celoris" className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">Celoris Designs</h4>
                                            <p className="text-xs text-slate-400">Pioneering AI-First Development</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                        Specializing in advanced AI Systems and Multimodal Engineering. We help engineers bridge the gap between text-only LLMs and complex perception-driven AI.
                                    </p>
                                    <div className="flex items-center justify-between text-sm py-3 border-t border-slate-800">
                                        <div className="flex items-center gap-1.5 text-slate-300">
                                            <Star className="h-4 w-4 fill-cyan-400 text-cyan-400" />
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
                                            <div className="h-1.5 w-1.5 rounded-full bg-cyan-500/40 mt-1.5 flex-shrink-0" />
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
