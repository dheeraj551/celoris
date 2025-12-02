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
                        backgroundImage: 'url("https://anyslive.in/wp-content/uploads/2025/12/Gemini_Generated_Image_rdi845rdi845rdi8.png")'
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
                            <span className="bg-green-500/20 text-green-200 px-3 py-1 rounded-full text-sm backdrop-blur-sm border border-green-500/30">
                                Technology
                            </span>
                            <span className="text-gray-300 text-sm flex items-center gap-1">
                                <Clock className="h-3 w-3" /> 5 min read
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                            Beyond the Chatbot: The Rise of Multimodal and Agentic AI in Enterprise Workflows 🚀
                        </h1>
                        <div className="flex items-center gap-6 text-gray-300">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold">
                                    C
                                </div>
                                <div>
                                    <p className="font-medium text-white">Celoris</p>
                                    <p className="text-xs">Author</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>December 1, 2025</span>
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
                                Until recently, AI models were often siloed: Large Language Models (LLMs) handled text, while separate models handled images or audio. Multimodal AI breaks down these barriers.
                            </p>

                            <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center gap-2 text-green-700 dark:text-green-400">
                                1. Multimodal AI: The Unification of Senses 👁️👂
                            </h2>
                            <p>
                                A multimodal system can now seamlessly process, understand, and generate content across multiple data types—text, images, video, audio, and code—all within a single, unified framework.
                            </p>

                            <h3 className="text-xl font-semibold mt-8 mb-4">Why does this matter to businesses in India?</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <span className="font-bold text-green-500">•</span>
                                    <div>
                                        <strong className="text-text-primary">Holistic Content Creation:</strong> Imagine a marketing team in Mumbai asking an AI: "Create a campaign for our new sustainable energy product. I need the script, a corresponding high-resolution image of a solar farm, a 30-second voiceover in three different Indian languages (Hindi, Tamil, Marathi), and the social media caption." A multimodal AI delivers all these assets, ensuring brand consistency across every medium.
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-bold text-green-500">•</span>
                                    <div>
                                        <strong className="text-text-primary">Enhanced Diagnostics:</strong> In healthcare, a system can analyze a patient's textual medical history, compare it with visual scans (X-rays/MRIs), and listen to recorded patient symptom descriptions (audio), leading to a more accurate and comprehensive diagnosis.
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-bold text-green-500">•</span>
                                    <div>
                                        <strong className="text-text-primary">Improved Quality Control:</strong> In manufacturing, AI can analyze text-based maintenance logs, check against real-time video feeds of the assembly line, and process sensor data (numeric) to predict equipment failure far more accurately than before.
                                    </div>
                                </li>
                            </ul>

                            <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center gap-2 text-green-700 dark:text-green-400">
                                2. Agentic AI: From Assistants to Autonomous Workers 💼
                            </h2>
                            <p>
                                If Multimodal AI gives the system more "senses," Agentic AI gives it the ability to act autonomously.
                            </p>
                            <p>
                                An Agentic AI system is an autonomous entity that can break down a high-level goal into a series of steps, execute those steps using external tools (like searching the web, running code, or interacting with a CRM), and iterate or self-correct based on feedback—all without constant human prompting.
                            </p>

                            <div className="bg-green-50 p-6 rounded-lg my-8 border border-green-100 dark:bg-green-900/20 dark:border-green-800">
                                <p className="font-medium text-green-900 dark:text-green-100 mb-2">The Shift:</p>
                                <p className="text-green-800 dark:text-green-200">
                                    Prompt → Immediate Response <span className="mx-2">to</span> Goal → Planning → Execution → Achievement
                                </p>
                            </div>

                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <li className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                    <strong className="block mb-1 text-green-700 dark:text-green-400">Planning</strong>
                                    The agent decides what steps are needed to accomplish the task.
                                </li>
                                <li className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                    <strong className="block mb-1 text-green-700 dark:text-green-400">Memory and Learning</strong>
                                    It remembers past successful and failed actions.
                                </li>
                                <li className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                    <strong className="block mb-1 text-green-700 dark:text-green-400">Tool Use</strong>
                                    It can access external APIs (e.g., a banking system's API to process a refund).
                                </li>
                                <li className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                    <strong className="block mb-1 text-green-700 dark:text-green-400">Self-Correction</strong>
                                    If one step fails, the agent re-plans the sequence.
                                </li>
                            </ul>

                            <h3 className="text-xl font-semibold mt-8 mb-4">Example for an Indian BPO/IT Firm:</h3>
                            <p>A firm wants to implement a new policy. An Agentic AI could:</p>
                            <ol className="list-decimal pl-5 space-y-2 mt-4">
                                <li>Analyze the policy document (Text).</li>
                                <li>Generate a training video for employees (Video/Audio/Text).</li>
                                <li>Update the company's internal knowledge base (Text).</li>
                                <li>Send a personalized email summary to department heads (Text/Personalization).</li>
                                <li>Schedule Q&A sessions on the company calendar (Calendar Tool).</li>
                            </ol>
                            <p className="mt-4 italic text-text-secondary">
                                This ability to automate multi-step, knowledge-intensive workflows is where the true enterprise value lies.
                            </p>

                            <h2 className="text-2xl font-bold mt-12 mb-6 flex items-center gap-2 text-green-700 dark:text-green-400">
                                3. The Move to Personalized and Specialized Models 🧠
                            </h2>
                            <p>
                                The initial Generative AI wave was dominated by vast Large Language Models (LLMs). The next wave is characterized by Specialized, Smaller Models (SLMs) and hyper-personalization.
                            </p>
                            <p>
                                As AI adoption matures in India, companies are realizing that a massive, general-purpose LLM isn't always the best fit.
                            </p>
                            <p>
                                Indian enterprises, especially in banking and defense, prioritize data residency and privacy. Deploying smaller, fine-tuned models on their premises or on edge devices offers superior control, faster performance, and reduced reliance on massive, costly cloud infrastructure. This democratization of AI implementation is a huge driver for tier-2 and tier-3 city tech growth.
                            </p>

                            <div className="mt-12 pt-8 border-t">
                                <h2 className="text-2xl font-bold mb-6">Conclusion: Ready for the Transformation?</h2>
                                <p>
                                    The Indian tech landscape is primed to embrace Multimodal and Agentic AI. The combination of rich, diverse data (multiple languages, varied media formats) and the high demand for workflow automation makes this technology a game-changer.
                                </p>
                                <p className="mt-4 font-medium text-lg">
                                    The next few years won't just be about using AI; they'll be about integrating these intelligent agents and multimodal frameworks into the very DNA of business operations. For entrepreneurs and executives, the question is no longer "Should we use AI?" but "How quickly can we deploy our first autonomous AI agent?"
                                </p>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mt-12 pt-8 border-t flex flex-wrap gap-2">
                            <Tag className="h-4 w-4 text-text-secondary" />
                            {['AI', 'Enterprise', 'Multimodal', 'Agentic AI', 'Technology'].map((tag) => (
                                <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-green-100 hover:text-green-800 transition-colors cursor-default">
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
