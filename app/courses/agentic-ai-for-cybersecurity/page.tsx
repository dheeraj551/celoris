"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, HelpCircle, BookOpen, Zap, Eye, Lightbulb, Battery, Cpu, Radio, Shield, BarChart, Server, Workflow, Bot, Database, Search, Mail, Code, Terminal, MousePointer2, Layout, Music, Video, Mic, Image as ImageIcon, Lock, Activity, Target } from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { InteractiveQuiz } from "@/components/InteractiveQuiz"
import { Trophy } from "lucide-react"

export default function AgenticAICybersecurityCourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Agentic AI for Cybersecurity: Building and Scaling Autonomous Defense & Automation Systems";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        const descriptionText = "Build Agentic Systems for cybersecurity. Learn to reduce Tier 1 burnout by delegating triage, investigation, and remediation to specialized AI agents.";
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
        title: "Agentic AI for Cybersecurity",
        subtitle: "Building and Scaling Autonomous Defense & Automation Systems",
        description: "Move beyond simple Generative AI prompts to build Agentic Systems—AI that can reason, use security tools, and execute multi-step playbooks autonomously. Focus on reducing 'Tier 1 burnout' by delegating routine triage, investigation, and remediation to specialized AI agents.",
        students: 1250,
        rating: 4.95,
        duration: "6-8 Weeks (Self-paced)",
        price: 29999,
        currency: "INR",
        provider: "Celoris Designs",
        website: "https://www.celorisdesigns.com",
        url: "https://www.celorisdesigns.com/courses/agentic-ai-for-cybersecurity",
        learning_outcomes: [
            "Transition from standard automation (SOAR) to Agentic SOC architectures.",
            "Master frameworks like LangGraph, CrewAI, and AutoGen for security workflows.",
            "Connect AI agents to SIEMs (Splunk/Sentinel), EDRs (CrowdStrike), and Threat Intel APIs.",
            "Build 'Swarms' of investigation agents that correlate multi-source data in parallel.",
            "Implement Human-in-the-Loop (HITL) design patterns for high-stakes remediation.",
            "Secure your agents against prompt injection and adversarial attacks.",
            "Deploy Agentic RAG systems for private security knowledge bases.",
            "Automate dark web searches and OSINT gathering using specialized agents.",
            "Monitor and measure MTTR and 'Hours Saved' as key ROI metrics.",
            "Build production-grade bots for leaked secret monitoring and vulnerability patching."
        ],
        requirements: [
            "Basic understanding of Cybersecurity concepts (SIEM, EDR, TTPs)",
            "Proficiency in Python programming",
            "Familiarity with LLM basics (GPT, Claude, or Llama)",
            "Experience with API integrations is helpful"
        ],
        chapters: [
            {
                number: 1,
                title: "The Agentic Shift in Defense",
                icon: "Zap",
                topics: [
                    "The Problem: Why SOAR and traditional automation failed to stop burnout.",
                    "The Solution: Definition of Agentic AI vs. GenAI vs. Standard Automation.",
                    "The 'Agentic SOC' Architecture: Moving from human-led triage to agent-led investigation.",
                    "Market Trends: Analysis of vendor adoption (Google SecOps, Microsoft Copilot, and open-source frameworks)."
                ],
                duration: "1 Week"
            },
            {
                number: 2,
                title: "The Technical Stack for Security Agents",
                icon: "Cpu",
                topics: [
                    "LLMs for Reasoning: GPT-4o, Claude 3.5, and local models (Llama 3) for privacy.",
                    "Frameworks: Hands-on with LangGraph, CrewAI, and AutoGen for security workflows.",
                    "Memory & State: How agents remember past incidents to improve future responses.",
                    "Tool Calling: Connecting AI to SIEMs, EDRs, and Threat Intel APIs."
                ],
                duration: "1.5 Weeks"
            },
            {
                number: 3,
                title: "Building Defensive Agents (The Blue Team)",
                icon: "Shield",
                topics: [
                    "The Triage Agent: Automating the 'False Positive vs. True Positive' decision loop.",
                    "Investigation Agents: Building 'Swarms' that gather logs and correlate identity data.",
                    "The Remediation Agent: Executing surgical containment based on reasoning.",
                    "Lab: Build an agent that investigates a Phishing alert from start to finish."
                ],
                duration: "1.5 Weeks"
            },
            {
                number: 4,
                title: "Autonomous Threat Intelligence & Hunting",
                icon: "Search",
                topics: [
                    "Agentic RAG: Building a private security knowledge base that agents can query.",
                    "Dark Web & OSINT Agents: Automating the search for leaked credentials.",
                    "Continuous Hunting: Deploying agents that look for 'Living off the Land' (LotL) techniques.",
                    "Hands-on: Engineering a multi-source threat intelligence aggregator."
                ],
                duration: "1 Week"
            },
            {
                number: 5,
                title: "Security of the Agents (Guardrails & Governance)",
                icon: "Lock",
                topics: [
                    "Prompt Injection in Security: Preventing attackers from 'hacking' defensive agents.",
                    "Human-in-the-Loop (HITL): Design patterns for high-stakes actions ('Human disposes').",
                    "Auditability: Maintaining a transparent 'chain of thought' for compliance.",
                    "Governance: Managing 'Agent Sprawl' and compute costs."
                ],
                duration: "1 Week"
            }
        ],
        faqs: [
            {
                question: "Do I need to be a Python expert?",
                answer: "Intermediate Python is required. We cover the specific libraries (LangChain/LangGraph) used for agents, but you should be comfortable with scripts and APIs."
            },
            {
                question: "Is this course relevant for Red Teamers?",
                answer: "While we focus on defense (Blue Team), the principles of building autonomous agents are directly applicable to offensive security automation and red team operations."
            },
            {
                question: "Can I run these agents locally?",
                answer: "Yes, we cover how to use local models like Llama 3 with Ollama or vLLM to ensure data privacy for security logs."
            },
            {
                question: "Will we get access to the code used in labs?",
                answer: "Absolutely. You get full access to the GitHub repository containing all agents, templates, and orchestration playbooks."
            }
        ],
        projects: [
            {
                title: "The 'Silent Guardian' Bot",
                description: "An agent that monitors GitHub for leaked secrets and automatically rotates them.",
                tools: "LangGraph + GitHub API + AWS Secrets Manager",
                icon: "Bot"
            },
            {
                title: "Multi-Agent War Room",
                description: "Agents (Researcher, Forensic Analyst, Responder) 'chat' to solve a ransom incident.",
                tools: "CrewAI + ELK Stack + Slack Integration",
                icon: "Shield"
            },
            {
                title: "Vulnerability Patcher",
                description: "An agent that reads scan reports, writes patches, and opens PRs for review.",
                tools: "AutoGen + Snyk + GitHub Actions",
                icon: "Activity"
            }
        ],
        quiz_data: [
            {
                title: "Section 1: The 2025 Global Threat Landscape",
                questions: [
                    {
                        question: "According to CrowdStrike, what was the fastest recorded eCrime breakout time in 2024?",
                        options: ["48 minutes", "51 seconds", "10 minutes", "5 minutes"],
                        correctIndex: 1,
                        explanation: "CrowdStrike's 2025 Global Threat Report recorded a lightning-fast breakout time of just 51 seconds in 2024."
                    },
                    {
                        question: "What percentage of detections in 2024 were found to be malware-free?",
                        options: ["40%", "50%", "79%", "26%"],
                        correctIndex: 2,
                        explanation: "An staggering 79% of intrusions in 2024 involved malware-free techniques, leveraging compromised credentials and legitimate tools."
                    },
                    {
                        question: "Which nation-state nexus saw a 150% increase in activity according to 2024 data?",
                        options: ["North Korea", "Russia", "China", "Iran"],
                        correctIndex: 2,
                        explanation: "China-nexus adversaries saw a massive 150% increase in activity, focusing on persistence and stealth."
                    },
                    {
                        question: "The 'math problem' facing modern SOCs refers to what imbalance?",
                        options: ["High budgets versus low software quality", "Exponentially expanding attack surfaces versus linear headcount growth", "Increasing salaries versus decreasing skill levels", "Too many firewalls versus too few endpoints"],
                        correctIndex: 1,
                        explanation: "The 'SOC Math Problem' is the gap between the exponential growth of data/threats and the linear ability to hire and train analysts."
                    },
                    {
                        question: "Which adversary is specifically noted for using Generative AI to supercharge insider threats?",
                        options: ["CHATTY SPIDER", "FAMOUS CHOLLIMA", "LIMINAL PANDA", "SLICK STINGER"],
                        correctIndex: 1,
                        explanation: "FAMOUS CHOLLIMA (North Korea) uses GenAI to create fake personas and infiltrate companies as remote workers."
                    },
                    {
                        question: "What was the year-over-year surge in ransomware attacks reported in 2025?",
                        options: ["25%", "50%", "100%", "703%"],
                        correctIndex: 3,
                        explanation: "The 2025 landscape saw a dramatic 703% surge in ransomware-related phishing and initial access activity."
                    },
                    {
                        question: "In 2025, how many corporate network access listings were typically found for sale on cybercrime forums?",
                        options: ["Over 1,000", "Over 2,000", "Over 3,000", "Over 10,000"],
                        correctIndex: 2,
                        explanation: "Over 3,000 corporate access listings were identified on criminal forums, highlighting the scale of initial access brokers."
                    },
                    {
                        question: "Which sector suffered the highest operational disruption due to attacks on OT and ICS environments?",
                        options: ["Manufacturing", "Healthcare", "Financial Services", "Retail"],
                        correctIndex: 0,
                        explanation: "Manufacturing remains the primary target for OT/ICS attacks due to its direct impact on supply chains and production."
                    }
                ]
            },
            {
                title: "Section 2: Defining the AI SOC and Agentic AI",
                questions: [
                    {
                        question: "What is the primary difference between Generative AI (GenAI) and Agentic AI?",
                        options: ["GenAI is faster than Agentic AI", "GenAI is offensive, while Agentic AI is defensive", "GenAI acts as an assistant (summarising/reporting), while Agentic AI acts as an autonomous actor (executing tasks)", "There is no difference; they are interchangeable terms"],
                        correctIndex: 2,
                        explanation: "Agentic AI moves from 'talking' (GenAI) to 'doing'—it carries out multi-step tasks autonomously."
                    },
                    {
                        question: "An 'Agentic SOC' is defined as a model where:",
                        options: ["Decision-making for routine tasks is decoupled from human intervention", "Human analysts are replaced entirely by a single LLM", "All security tools are moved to a local server", "Only phishing emails are automated"],
                        correctIndex: 0,
                        explanation: "In an Agentic SOC, the AI handles the routine thinking and execution, escalating only when it hits a judgment boundary."
                    },
                    {
                        question: "What does the term 'Hyperautomation' refer to in the context of an Agentic SOC?",
                        options: ["Using multiple firewalls simultaneously", "The evolution of SOAR through AI-driven reasoning to adapt workflows in real-time", "Automating the payroll of security analysts", "Increasing the speed of internet connections"],
                        correctIndex: 1,
                        explanation: "Hyperautomation is the shift from static scripts to AI agents that can adapt their workflow based on the live context of a threat."
                    },
                    {
                        question: "Which capability allows Agentic AI to improve over time by reviewing its own errors?",
                        options: ["Static Scripting", "Hard-coding", "Self-reflection and feedback loops", "Manual data entry"],
                        correctIndex: 2,
                        explanation: "Self-reflection allows agents to critique their own work and adjust their reasoning to correct mistakes without human input."
                    },
                    {
                        question: "In the 'Self-Driving Car' analogy for SOCs, what represents the 'Fuel'?",
                        options: ["The SOC Manager", "Unified Telemetry", "Compliance reports", "The annual budget"],
                        correctIndex: 1,
                        explanation: "Data (Unified Telemetry) is the fuel that powers the reasoning engine of an Agentic AI system."
                    },
                    {
                        question: "What is the 'Maintenance Trap' associated with traditional SOAR?",
                        options: ["Spending more time maintaining rigid playbooks than investigating threats", "The cost of electricity for servers", "The need to clean hardware components", "High subscription fees for antivirus software"],
                        correctIndex: 0,
                        explanation: "Traditional SOAR requires manual upkeep of fragile playbooks; Agentic AI replaces these with dynamic reasoning."
                    }
                ]
            },
            {
                title: "Section 3: Professional Roles and Evolution",
                questions: [
                    {
                        question: "Which new role is responsible for reviewing and approving decisions made by AI agents?",
                        options: ["AI Systems Engineer", "AI Validation Analyst", "Automation Policy Lead", "AI Behavior Auditor"],
                        correctIndex: 1,
                        explanation: "Validation Analysts act as the 'Human disposes' layer, verifying that the AI's complex findings are correct."
                    },
                    {
                        question: "How does the role of a Tier 1 Analyst change in an Agentic SOC?",
                        options: ["They are promoted to CEO", "Their repetitive triage duties are automated, allowing them to focus on validating AI outputs", "They no longer need to understand cybersecurity", "They move into a pure data entry role for the LLM"],
                        correctIndex: 1,
                        explanation: "Analysts move 'up the stack' to focus on high-context validation instead of manual, low-level alerting."
                    },
                    {
                        question: "What is the focus of a 'Threat Hunter' in an AI-augmented SOC?",
                        options: ["Writing incident reports manually", "Hypothesis creation, validation, and adversarial reasoning", "Filtering through thousands of false positives", "Checking if the server is plugged in"],
                        correctIndex: 1,
                        explanation: "With AI handling the noise, Threat Hunters can finally focus on deep hypothesis-driven work."
                    },
                    {
                        question: "The 'AI Systems Engineer' focuses on:",
                        options: ["Maintaining the operational health of agentic frameworks and model retraining", "Negotiating with ransomware groups", "Installing Windows updates on workstations", "Managing the company's social media security"],
                        correctIndex: 0,
                        explanation: "This role ensures the underlying agentic platform, its prompts, and its integrations stay healthy."
                    }
                ]
            },
            {
                title: "Section 4: Vendor-Specific Innovations",
                questions: [
                    {
                        question: "Which subscription level is required to have Microsoft Security Copilot included for customers?",
                        options: ["Microsoft 365 Business", "Microsoft 365 E3", "Microsoft 365 E5", "Office 365 Home"],
                        correctIndex: 2,
                        explanation: "Security Copilot and associated integrations are primary features of the Microsoft 365 E5 tier."
                    },
                    {
                        question: "What is the reported increase in detection speed for malicious emails using Microsoft’s Phishing Triage Agent?",
                        options: ["100%", "250%", "550%", "77%"],
                        correctIndex: 2,
                        explanation: "Agents can process the massive volume of phishing data significantly faster, with some reporting up to 550% speed gains."
                    },
                    {
                        question: "CrowdStrike's Charlotte AI Detection Triage Agent reports a decision accuracy of over:",
                        options: ["80%", "90%", "98%", "75%"],
                        correctIndex: 2,
                        explanation: "Tested against standard triage benchmarks, Charlotte AI achieves 98%+ accuracy in identifying true positives."
                    },
                    {
                        question: "According to CrowdStrike, how much time is saved per detection by automating triage?",
                        options: ["1 minute", "At least 5 minutes", "30 seconds", "1 hour"],
                        correctIndex: 1,
                        explanation: "Automated triage saves at least 5 minutes per alert, which adds up to thousands of hours annually in large SOCs."
                    },
                    {
                        question: "What is the name of Google Cloud’s modern, AI-powered SecOps platform?",
                        options: ["Falcon", "Sentinel", "Google SecOps", "Cortex"],
                        correctIndex: 2,
                        explanation: "Google SecOps (formerly Chronicle) is the core of their autonomous security vision."
                    },
                    {
                        question: "Which Alias Robotics model is purpose-built for 'unrestricted' cybersecurity tasks?",
                        options: ["GPT-4", "Claude", "alias1", "Llama"],
                        correctIndex: 2,
                        explanation: "alias1 is a cybersecurity-specific model designed without the typical refusals for security research."
                    },
                    {
                        question: "What is the primary benefit of the CAI PRO framework's 'Parallel Agent Swarms'?",
                        options: ["It makes the TUI look better", "Deploying hundreds of specialized agents simultaneously for massive coverage", "It reduces the cost of internet bandwidth", "It allows agents to talk to each other about non-work topics"],
                        correctIndex: 1,
                        explanation: "Swarms allow you to do things like check 500 endpoints for a specific file at the same time using local agents."
                    },
                    {
                        question: "Which protocol, developed by Google, enables interoperability between AI agents from different providers?",
                        options: ["HTTP", "SMTP", "Agent2Agent (A2A)", "FTP"],
                        correctIndex: 2,
                        explanation: "The A2A protocol allows a Microsoft agent to delegate a task to a Google agent or vice-versa."
                    },
                    {
                        question: "What does the Model Context Protocol (MCP) aim to solve?",
                        options: ["The 'NxM' integration problem between many models and many tools", "The speed of light in fibre optic cables", "Password complexity requirements", "The number of emails sent per day"],
                        correctIndex: 0,
                        explanation: "MCP provides a standardized way for any AI model to safely interact with any data source or tool."
                    }
                ]
            },
            {
                title: "Section 5: Tactical Implementation and Metrics",
                questions: [
                    {
                        question: "'Mean Time to Conclusion' (MTTC) is a metric highlighting:",
                        options: ["How long it takes to hire an analyst", "The reduction in time to finish an investigation using AI", "The time it takes for a server to reboot", "The length of a security briefing"],
                        correctIndex: 1,
                        explanation: "MTTC measures the efficiency gains from AI correlating data much faster than a human could."
                    },
                    {
                        question: "Why is 'Human-on-the-Loop' governance preferred over 'Human-in-the-Loop' as trust grows?",
                        options: ["It requires more humans to work at night", "Humans monitor performance and step in only when necessary, rather than approving every action", "It is a cheaper licensing model", "It prevents the AI from learning too much"],
                        correctIndex: 1,
                        explanation: "On-the-loop allows for massive scale; the AI acts autonomously, but the human retains total supervisory control."
                    },
                    {
                        question: "What is a 'Kill-Switch' in the context of Agentic AI?",
                        options: ["A mechanism to immediately stop an agent if it behaves unexpectedly", "A physical button on the laptop", "A command to delete all logs", "A way to fire an analyst"],
                        correctIndex: 0,
                        explanation: "Every autonomous system must have an emergency stop to prevent run-away actions."
                    },
                    {
                        question: "In the Agentic SOC, why can detection sensitivity be safely increased?",
                        options: ["Because hackers are becoming less skilled", "Because cloud storage is cheaper", "Because AI agents provide an infinite capacity layer to triage the resulting noise", "Because false positives no longer exist"],
                        correctIndex: 2,
                        explanation: "AI can triage the additional noise, allowing you to catch subtler threats you would previously have ignored."
                    },
                    {
                        question: "What is 'Analyst Notes Reconstruction' in Microsoft Defender?",
                        options: ["A way to record audio in the SOC", "An AI feature that automatically turns an investigation session into structured notes", "A backup of the analyst's personal files", "A tool for checking spelling and grammar"],
                        correctIndex: 1,
                        explanation: "It uses AI to digest hours of investigation steps into a perfect clear executive summary."
                    },
                    {
                        question: "What is the 'DIY Trap' warned about by security experts?",
                        options: ["Trying to fix your own hardware", "Building your own AI SOC engine from scratch instead of using established platforms", "Using free versions of antivirus", "Setting your own passwords"],
                        correctIndex: 1,
                        explanation: "Building the core reasoning and state-management engine is extremely difficult; companies should use proven frameworks like LangGraph."
                    }
                ]
            },
            {
                title: "Section 6: Advanced Concepts and Strategy",
                questions: [
                    {
                        question: "What is the 'Funnel of Fidelity' problem?",
                        options: ["A lack of trustworthy employees", "The need to filter massive alert volumes with fixed human capacity, leading to blind spots", "High latency in satellite communications", "The process of encrypting data for transit"],
                        correctIndex: 1,
                        explanation: "Humans can only look at so much; the 'funnel' forces teams to turn off detectors just to survive the noise."
                    },
                    {
                        question: "Which framework provides an open-source library for building offensive and defensive AI automation?",
                        options: ["Microsoft Office", "CAI (Cybersecurity AI)", "Adobe Creative Cloud", "Salesforce"],
                        correctIndex: 1,
                        explanation: "CAI is the standard library for building high-performance cybersecurity agents."
                    },
                    {
                        question: "'Adversarial Robustness' for an AI agent means:",
                        options: ["It can run on any operating system", "It is resistant to physical theft", "It is designed to withstand attempts by hackers to probe, poison, or subvert it", "It can work without an internet connection"],
                        correctIndex: 2,
                        explanation: "Security agents must be able to ignore 'jailbreak' attempts and prompt injections while they investigate hackers."
                    },
                    {
                        question: "Which term describes providing agents with unique, verifiable identities and fine-grained permissions?",
                        options: ["OAuth", "Agentic Identity and Access Management (AIAM)", "Two-Factor Authentication", "Biometric Scanning"],
                        correctIndex: 1,
                        explanation: "AIAM ensures that every action an agent takes can be audited back to its specific identity and policy."
                    },
                    {
                        question: "What is the 'Sweet Middle' of Incident Response that Agentic AI targets?",
                        options: ["Resetting passwords for employees", "Negotiating with the Board for more budget", "Tier 1 and Tier 2 work like context gathering, enrichment, and initial reasoning", "Physically securing the data centre"],
                        correctIndex: 2,
                        explanation: "AI is most powerful at the 80% of work that is time-consuming but routine (T1/T2)."
                    },
                    {
                        question: "How does Agentic AI help with the 'Skills Shortage'?",
                        options: ["By mimicking the human-like decision process to automate tasks that previously required more staff", "By teaching people how to code in one hour", "By allowing companies to pay analysts less", "By making the job so easy that children can do it"],
                        correctIndex: 0,
                        explanation: "By cloning the 'reasoning' of a Tier 3 analyst into an agent, you multiply your force without hiring 100 juniors."
                    },
                    {
                        question: "In Microsoft’s vision, the Threat Intelligence Briefing Agent provides:",
                        options: ["A list of news articles from the morning", "Daily, tailored briefings combining global intelligence with organization-specific context", "A weather report for the SOC location", "Alerts about upcoming social events"],
                        correctIndex: 1,
                        explanation: "It eliminates generic news by showing only what threats actually matter to *your* unique infrastructure."
                    }
                ]
            },
            {
                title: "Section 7: Governance, Risks, and Future Outlook",
                questions: [
                    {
                        question: "Why is 'Explainability' a critical requirement for CISOs adopting AI?",
                        options: ["'Black box' decisions are unacceptable; AI must provide citations and logic for its actions", "It makes the software more expensive", "Analysts enjoy reading long explanations", "It is required by international copyright law"],
                        correctIndex: 0,
                        explanation: "A SOC cannot take a destructive action (like blocking a CEO's laptop) without a clear 'Chain of Thought' explaining why."
                    },
                    {
                        question: "Which regulation began setting global expectations for responsible AI in 2025?",
                        options: ["The Patriot Act", "Europe’s AI Act", "GDPR 2.0", "The Digital Millennium Copyright Act"],
                        correctIndex: 1,
                        explanation: "The EU AI Act is the first major regulatory framework to classify and govern high-risk AI uses."
                    },
                    {
                        question: "What is a 'Hallucination' in AI terms?",
                        options: ["A virus that makes the screen flicker", "When the AI provides a confident but false or fabricated answer", "A power surge in the data centre", "When the AI takes a scheduled break"],
                        correctIndex: 1,
                        explanation: "Hallucinations are the biggest risk in the SOC, which is why 'Self-Reflection' and HITL are mandatory."
                    },
                    {
                        question: "According to Omdia, when will the autonomous SOC likely become a standard for CISOs?",
                        options: ["In 10 years", "In 5 years", "Within 1-2 years", "It is already the standard everywhere"],
                        correctIndex: 2,
                        explanation: "Analyst firm Omdia predicts the shift to autonomous SOCs will hit the mainstream within 24 months."
                    },
                    {
                        question: "What is the 'Governance Trap' in AI security?",
                        options: ["Having too many lawyers in the company", "Letting a model make all decisions without controls, leading to risks like isolating critical systems accidentally", "Paying too much for compliance certifications", "Using the wrong fonts in official documents"],
                        correctIndex: 1,
                        explanation: "Governance must define exactly what an agent can and cannot do independently."
                    },
                    {
                        question: "Which open-source framework is used to build resilient language agents as graphs?",
                        options: ["Microsoft Word", "LangGraph", "WordPress", "Docker"],
                        correctIndex: 1,
                        explanation: "LangGraph (by LangChain) is the premier tool for building stateful, multi-agent security 'graphs'."
                    },
                    {
                        question: "The 'AI Chief Compliance Officer' is a new role responsible for:",
                        options: ["Establishing policy for regulatory frameworks governing system-to-system AI use", "Checking if employees are wearing their ID badges", "Managing the company's tax returns", "Running the fire drills in the building"],
                        correctIndex: 0,
                        explanation: "This role manages the legal and ethical boundaries of interacting AI swarms."
                    },
                    {
                        question: "Why is 'Data Sovereignty' emphasized by European AI providers like Alias Robotics?",
                        options: ["To ensure the AI speaks local languages", "To ensure sensitive security data never leaves European jurisdiction", "To promote local tourism", "To avoid paying international shipping fees"],
                        correctIndex: 1,
                        explanation: "In security, you cannot afford to send your network logs to a model that might be trained by a competitor or adversary."
                    },
                    {
                        question: "By 2026, resilience in cybersecurity is described as being about:",
                        options: ["Never being breached", "Awareness, decisiveness, and staying ahead of threats through machine-speed investigation", "Buying the most expensive tools available", "Hiring only analysts with 20 years of experience"],
                        correctIndex: 1,
                        explanation: "Breaches are inevitable; resilience is how fast your agents can find and stop them automatically."
                    },
                    {
                        question: "What does the 'A2A Client' do in the Agent2Agent protocol?",
                        options: ["It pays the bill for the AI service", "It is the initiator agent that delegates a request to a remote agent", "It cleans the data before the AI sees it", "It translates human speech into code"],
                        correctIndex: 1,
                        explanation: "The A2A Client is the 'manager' agent that finds and talks to other agents to get a job done."
                    }
                ]
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Agentic AI for Cybersecurity",
        "description": "Building and Scaling Autonomous Defense & Automation Systems. Reduce SOC burnout with specialized AI agents.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs",
            "sameAs": "https://www.celorisdesigns.com"
        },
        "educationalLevel": "Advanced",
        "teaches": [
            "Agentic SOC Architecture",
            "LangGraph for Security",
            "Autonomous Incident Response",
            "Threat Hunting Agents",
            "Security Agent Guardrails",
            "OSINT Automation"
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
                                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Agentic AI</span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Cybersecurity</span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Automation</span>
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

                        {/* Course Preview Image with Glassmorphism */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Card className="relative overflow-hidden border-0 bg-slate-900/50 backdrop-blur-xl rounded-2xl">
                                <div className="aspect-video relative overflow-hidden">
                                    <img
                                        src="/agentic-ai-cybersecurity-cover.png"
                                        alt="Agentic AI for Cybersecurity"
                                        className="w-full h-full object-cover transform transition duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Button size="lg" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 rounded-full h-20 w-20 p-0 flex items-center justify-center group/btn" asChild>
                                            <Link href="#">
                                                <Play className="h-8 w-8 fill-white group-hover/btn:scale-110 transition-transform ml-1" />
                                            </Link>
                                        </Button>
                                    </div>
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
                                        chapter.icon === "Cpu" ? Cpu :
                                            chapter.icon === "Shield" ? Shield :
                                                chapter.icon === "Search" ? Search : Lock;
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
                                                <div className="pl-14 space-y-4">
                                                    <div className="h-px bg-gradient-to-r from-cyan-500/30 to-transparent mb-4"></div>
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
                                The Autonomous SOC Stack
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: "Frameworks", value: "LangGraph, CrewAI" },
                                    { label: "LLMs", value: "GPT-4o, Claude 3.5, Llama 3" },
                                    { label: "Integrations", value: "Splunk, Sentinel, EDR" },
                                    { label: "Search", value: "Tavily, Firecrawl, Shodan" }
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
                                    <Target className="h-6 w-6 text-blue-400" />
                                </div>
                                Practical Lab Projects
                            </h2>
                            <p className="text-slate-400 mb-8">
                                Hands-on engineering projects designed to automate the drudgery of Tier 1 analysis and remediation.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {courseData.projects.map((item, index) => {
                                    const Icon = item.icon === "Bot" ? Bot : item.icon === "Shield" ? Shield : Activity;
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
                            <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Future-Proofing Your Career</h3>
                            <p className="text-lg text-slate-300 leading-relaxed italic relative z-10">
                                "The drudgery of Tier 1 analysis is being replaced by AI. This course doesn't just teach you to use AI; it teaches you to build the systems that will define the next decade of cybersecurity defense."
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
                                    Agentic AI & SOC Mastery Assessment
                                </h2>
                                <p className="text-slate-400 mt-2">Validate your expertise in building autonomous defense systems, agentic swarms, and AI-driven SOC playbooks.</p>
                            </div>
                            <InteractiveQuiz
                                quizTitle="Agentic AI & SOC Mastery Assessment"
                                quizDescription="50 questions covering the 2025 threat landscape, Agentic AI architectures, and production-ready security automation."
                                quizUnits={courseData.quiz_data}
                                onCompleteMessage={(score) => {
                                    if (score >= 90) return "Defense Architect! You are fully prepared to engineer autonomous security systems.";
                                    if (score >= 70) return "Agentic Engineer! You have a solid grasp of modern AI-driven defense patterns.";
                                    return "Keep Building! Review the agentic governance and orchestration modules to strengthen your skills.";
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
                                            <div className="text-5xl font-extrabold text-white mb-2 tracking-tighter">
                                                ₹{courseData.price}
                                            </div>
                                            <div className="text-cyan-400 font-bold tracking-widest uppercase text-xs">Full Lifetime Access</div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <CourseInquiryDialog
                                                courseTitle={courseData.title}
                                                buttonClassName="w-full h-14 text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-2xl shadow-lg shadow-cyan-500/25 transition-all active:scale-95"
                                            />
                                            <Button
                                                variant="outline"
                                                className="w-full h-12 border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl"
                                                onClick={() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })}
                                            >
                                                Take Mastery Quiz
                                            </Button>
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-slate-800">
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Award className="h-5 w-5 text-cyan-400" />
                                                <span>Professional Certification</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Activity className="h-5 w-5 text-purple-400" />
                                                <span>Real-world SOC Playbooks</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Users className="h-5 w-5 text-blue-400" />
                                                <span>Intensive AI-Security Community</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Zap className="h-5 w-5 text-orange-400" />
                                                <span>Practical Hacking Labs</span>
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
                                        Specializing in advanced Agentic AI Systems and Cybersecurity Automation. We bridge the gap between traditional SOC workflows and autonomous AI-driven defense.
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
