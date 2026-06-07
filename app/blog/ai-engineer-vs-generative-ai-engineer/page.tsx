'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Clock, Tag, Share2 } from "lucide-react";

export default function BlogPost() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative h-[400px] w-full overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url("/any_ai.png")'
                    }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                <div className="container relative h-full flex flex-col justify-center text-white">
                    <Button variant="ghost" className="text-white w-fit mb-8 hover:bg-white/20" asChild>
                        <Link href="/blog">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Blog
                        </Link>
                    </Button>

                    <div className="max-w-4xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-emerald-500/20 text-emerald-200 px-3 py-1 rounded-full text-sm backdrop-blur-sm border border-emerald-500/30">
                                Career & Skill Development
                            </span>
                            <span className="text-gray-300 text-sm flex items-center gap-1">
                                <Clock className="h-3 w-3" /> 10 min read
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            AI Engineer vs Generative AI Engineer: What's the Real Difference?
                        </h1>
                        <div className="flex items-center gap-6 text-gray-300">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-bold">
                                    C
                                </div>
                                <div>
                                    <p className="font-medium text-white">Celoris Learning</p>
                                    <p className="text-xs">Author</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>June 2025</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-surface rounded-2xl p-8 md:p-12 shadow-sm border">
                        <div className="prose prose-lg max-w-none dark:prose-invert">
                            <p className="lead text-xl text-text-secondary mb-8">
                                Two of the most in-demand tech roles today share a name — but almost nothing else. Here's a clear, honest breakdown of what each actually does, what tools they use, and which career path is right for you.
                            </p>
                            <p>
                                If you've been browsing job boards lately, you've probably noticed both "AI Engineer" and "Generative AI Engineer" appearing — sometimes in the same company, sometimes even in the same posting. They sound interchangeable. They are not.
                            </p>
                            <p>
                                This guide cuts through the confusion. We'll break down the focus, toolkit, day-to-day work, job market demand, and career trajectory of each role — drawing directly from how the industry defines them today.
                            </p>

                            <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                The Core Distinction: Build vs. Apply
                            </h2>
                            <p>
                                The simplest way to understand the difference is this: an AI Engineer builds the engine. A Generative AI Engineer drives it to a destination.
                            </p>
                            <p>
                                Traditional AI Engineers are concerned with creating machine learning systems from scratch — designing architectures, training models on datasets, optimizing performance metrics, and deploying pipelines. Generative AI Engineers, on the other hand, assume that powerful pre-trained models (like GPT-4, Claude, or Gemini) already exist, and their job is to integrate those models into real products that generate value for users.
                            </p>

                            <div className="bg-emerald-50 p-6 rounded-lg my-8 border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800">
                                <p className="font-medium text-emerald-900 dark:text-emerald-100 italic">
                                    "AI Engineer creates the engine and transmission. Generative AI Engineer creates the luxury performance experience that uses it."
                                </p>
                            </div>

                            <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                Role Deep Dive: AI Engineer
                            </h2>
                            <p>
                                An AI Engineer (sometimes called an ML Engineer) sits at the intersection of data science and software engineering. Their primary focus is on the mathematical and computational machinery that powers AI — training models to make accurate predictions, labeling and processing data, and deploying models reliably at scale.
                            </p>

                            <h3 className="text-xl font-semibold mt-8 mb-4">What an AI Engineer actually does</h3>
                            <p>
                                Day to day, this role involves designing and training custom neural networks or classical ML models for classification, regression, recommendation, or anomaly detection tasks. They work closely with data scientists and data engineers to build ETL pipelines that feed clean, structured data into training jobs. They also manage MLOps workflows — versioning models, monitoring drift, and automating retraining cycles.
                            </p>
                            <p className="font-medium mt-4">
                                The central question driving their work is: "Which model should I design and train to most accurately classify this data?"
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">AI Engineer Toolkit</h4>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2"><span className="text-emerald-500">•</span> Python</li>
                                        <li className="flex items-center gap-2"><span className="text-emerald-500">•</span> TensorFlow & PyTorch</li>
                                        <li className="flex items-center gap-2"><span className="text-emerald-500">•</span> scikit-learn</li>
                                        <li className="flex items-center gap-2"><span className="text-emerald-500">•</span> MLOps & ETL Pipelines</li>
                                        <li className="flex items-center gap-2"><span className="text-emerald-500">•</span> Model Optimization</li>
                                        <li className="flex items-center gap-2"><span className="text-emerald-500">•</span> ML/DL Frameworks</li>
                                    </ul>
                                </div>
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
                                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">Gen AI Engineer Toolkit</h4>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2"><span className="text-emerald-500">•</span> LangChain</li>
                                        <li className="flex items-center gap-2"><span className="text-emerald-500">•</span> OpenAI API & Libraries</li>
                                        <li className="flex items-center gap-2"><span className="text-emerald-500">•</span> Vector DBs (Pinecone, Weaviate)</li>
                                        <li className="flex items-center gap-2"><span className="text-emerald-500">•</span> RAG Engineering</li>
                                        <li className="flex items-center gap-2"><span className="text-emerald-500">•</span> Vertex AI & Bedrock</li>
                                        <li className="flex items-center gap-2"><span className="text-emerald-500">•</span> Prompt Engineering</li>
                                    </ul>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                Role Deep Dive: Generative AI Engineer
                            </h2>
                            <p>
                                A Generative AI Engineer is a newer breed of specialist who builds applications on top of Large Language Models (LLMs). Instead of training models, they focus on what happens after training — designing prompts, retrieval systems, agentic workflows, and user-facing experiences that leverage generative capabilities.
                            </p>
                            <p>
                                Their core focus areas are text generation, code synthesis, image creation, and multimodal content — all powered by foundation models they consume via API rather than build from scratch.
                            </p>
                            <p className="font-medium mt-4">
                                The central question driving their work is: "How can I integrate an LLM to build a specific, helpful user experience?"
                            </p>
                            <p className="mt-4">
                                RAG (Retrieval-Augmented Generation) pipelines are a major area of expertise here — connecting LLMs to proprietary knowledge bases via vector databases so the model can answer questions grounded in real, current data. Building agentic workflows using tools like LangChain or LlamaIndex, and deploying on managed platforms like AWS Bedrock or Google Vertex AI, are also core competencies.
                            </p>

                            <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                Side-by-Side Comparison
                            </h2>
                            <div className="overflow-x-auto my-8">
                                <table className="min-w-full border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                                            <th className="py-4 px-4 text-left font-bold">#</th>
                                            <th className="py-4 px-4 text-left font-bold">Skill / Responsibility</th>
                                            <th className="py-4 px-4 text-left font-bold">AI Engineer</th>
                                            <th className="py-4 px-4 text-left font-bold">Gen AI Engineer</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        <tr>
                                            <td className="py-4 px-4">1</td>
                                            <td className="py-4 px-4">Build and train custom models from scratch</td>
                                            <td className="py-4 px-4 text-emerald-600 dark:text-emerald-400 font-medium">✓ Yes</td>
                                            <td className="py-4 px-4 text-red-500 font-medium">✗ No</td>
                                        </tr>
                                        <tr>
                                            <td className="py-4 px-4">2</td>
                                            <td className="py-4 px-4">Develop solutions using pre-trained LLMs</td>
                                            <td className="py-4 px-4 text-red-500 font-medium">✗ No</td>
                                            <td className="py-4 px-4 text-emerald-600 dark:text-emerald-400 font-medium">✓ Yes</td>
                                        </tr>
                                        <tr>
                                            <td className="py-4 px-4">3</td>
                                            <td className="py-4 px-4">Implement RAG pipelines and vector databases</td>
                                            <td className="py-4 px-4 text-red-500 font-medium">✗ No</td>
                                            <td className="py-4 px-4 text-emerald-600 dark:text-emerald-400 font-medium">✓ Yes</td>
                                        </tr>
                                        <tr>
                                            <td className="py-4 px-4">4</td>
                                            <td className="py-4 px-4">Process and utilize large, structured datasets</td>
                                            <td className="py-4 px-4 text-emerald-600 dark:text-emerald-400 font-medium">✓ Yes</td>
                                            <td className="py-4 px-4 text-red-500 font-medium">✗ No</td>
                                        </tr>
                                        <tr>
                                            <td className="py-4 px-4">5</td>
                                            <td className="py-4 px-4">Architect AI agents and complex workflows</td>
                                            <td className="py-4 px-4 text-red-500 font-medium">✗ No</td>
                                            <td className="py-4 px-4 text-emerald-600 dark:text-emerald-400 font-medium">✓ Yes</td>
                                        </tr>
                                        <tr className="bg-slate-50 dark:bg-slate-800/30">
                                            <td className="py-4 px-4">6</td>
                                            <td className="py-4 px-4 font-semibold">Job Market Demand (2025)</td>
                                            <td className="py-4 px-4 font-bold">HIGH</td>
                                            <td className="py-4 px-4 font-bold text-emerald-600 dark:text-emerald-400">⭐ VERY HIGH</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                The Job Market Reality in 2025
                            </h2>
                            <p>
                                Both roles are genuinely in demand — but the momentum is different. Traditional AI/ML engineering has been a well-established discipline for a decade, and hiring is steady and deep. Generative AI Engineering, however, is experiencing explosive growth driven by the rapid enterprise adoption of LLM-powered products.
                            </p>
                            <p className="mt-4">
                                <strong>Why Gen AI Engineer demand is "Very High":</strong> Every company building a chatbot, internal knowledge assistant, AI-powered search, code generator, or content workflow needs people who can wire LLMs into real systems. The supply of qualified practitioners hasn't caught up — making this one of the highest-leverage skill sets you can develop right now.
                            </p>
                            <p className="mt-4">
                                Salaries reflect this gap. Generative AI Engineers at mid-level typically command 20–40% premiums over equivalently experienced ML Engineers in the same markets, particularly in the US, UK, and increasingly in India's tech hubs.
                            </p>

                            <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                Which Path Should You Choose?
                            </h2>
                            <p>
                                The honest answer depends on your background and appetite.
                            </p>
                            <p>
                                If you have a strong mathematical foundation — linear algebra, statistics, calculus — and enjoy working close to the research layer of AI, traditional AI Engineering offers a deeper technical foundation and is the right path. You'll own the full model development lifecycle.
                            </p>
                            <p>
                                If you're a software developer, product engineer, or someone coming from a data or analytics background who wants to build AI-powered applications quickly, Generative AI Engineering has a shorter ramp to productivity. You're standing on the shoulders of foundation model research and focusing on the application layer.
                            </p>
                            <p className="mt-4 font-medium">
                                Importantly, these roles are converging. Many senior practitioners are developing competency in both — using LLMs where appropriate and custom models where precision or domain specificity demands it. The long-term winner is the engineer who understands both layers.
                            </p>

                            <div className="mt-12 pt-8 border-t">
                                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                                
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold mb-2">Do I need a computer science degree to become a Generative AI Engineer?</h3>
                                        <p>Not necessarily. Many successful Gen AI Engineers come from software development, data analytics, or even non-technical backgrounds who learned API integration and prompt engineering through structured courses. A degree helps, but demonstrated project experience with LLM applications carries significant weight.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-2">Can an AI Engineer transition into Generative AI Engineering?</h3>
                                        <p>Yes, and it's increasingly common. Traditional ML Engineers already understand model behavior deeply, which gives them an advantage when designing RAG systems or evaluating LLM outputs. The main gaps to fill are familiarity with LLM APIs, prompt engineering, and vector database tooling.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-2">What programming language is most important for Gen AI Engineering?</h3>
                                        <p>Python dominates both roles. For Gen AI specifically, being comfortable with REST APIs, asynchronous Python, and at least one vector database SDK (like Pinecone or Weaviate) is the practical baseline for entry-level roles.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-2">Is Generative AI Engineering a long-term stable career?</h3>
                                        <p>The tooling will shift — the specific frameworks popular today may be replaced in two years. But the underlying skill of integrating AI capabilities into software products is durable. Engineers who understand the principles (context windows, embeddings, retrieval, evaluation) rather than just specific tools will remain highly relevant.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-2">What courses should I take to get started?</h3>
                                        <p>For AI Engineering: start with Python fundamentals, then move to scikit-learn for classical ML before tackling deep learning with PyTorch or TensorFlow. For Generative AI Engineering: Python + API fundamentals, followed by hands-on LangChain projects, then RAG pipeline development with a vector database.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-emerald-900/10 dark:bg-emerald-900/20 rounded-xl p-8 mt-12 border border-emerald-500/20">
                                <h2 className="text-2xl font-bold mb-4 text-emerald-800 dark:text-emerald-400">Key Takeaways</h2>
                                <ul className="space-y-4">
                                    <li className="flex gap-3">
                                        <span className="font-bold text-emerald-500">1.</span>
                                        <div>
                                            <strong>AI Engineers</strong> build and train machine learning models from data. They work with TensorFlow, PyTorch, scikit-learn, and MLOps tools to create systems that make predictions.
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-bold text-emerald-500">2.</span>
                                        <div>
                                            <strong>Generative AI Engineers</strong> build applications using pre-trained LLMs. They work with LangChain, RAG pipelines, vector databases, and cloud AI platforms to create systems that generate content.
                                        </div>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-bold text-emerald-500">3.</span>
                                        <div>
                                            Both roles are in high demand. Gen AI Engineering currently has stronger market tailwinds. The most valuable long-term position is developing fluency in both disciplines.
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mt-12 pt-8 border-t flex flex-wrap gap-2">
                            <Tag className="h-4 w-4 text-text-secondary" />
                            {['AI Careers', 'Machine Learning', 'Generative AI', 'Career Guide 2025'].map((tag) => (
                                <span key={tag} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/50 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors cursor-default">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
