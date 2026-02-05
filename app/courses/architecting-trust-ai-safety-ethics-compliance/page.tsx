"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, Download, CheckCircle, HelpCircle, BookOpen, Zap, Shield, Eye, Scale, AlertTriangle, ShieldCheck, Lock, Binary, FileText, Gavel, BarChart3, RotateCcw, Activity, Trophy, MessageSquare } from "lucide-react"
import { InteractiveQuiz } from "@/components/InteractiveQuiz"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"

export default function ArchitectingTrustCourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Architecting Trust: AI Safety, Ethics & Compliance | Celoris Designs";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        const descriptionText = "Master the frameworks, tools, and legal requirements necessary to deploy predictable, compliant, and ethical AI systems for the modern enterprise.";
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
        title: "Architecting Trust: AI Safety, Ethics & Compliance",
        subtitle: "Building Robust and Regulated AI Systems for the Modern Enterprise",
        description: "This program provides a 360-degree view of the AI lifecycle through the lens of safety and ethics. Participants will move beyond 'AI hype' to master the frameworks, tools, and legal requirements necessary to deploy AI that is not only powerful but also predictable and compliant.",
        students: 1240,
        rating: 4.95,
        duration: "6-8 Weeks (Self-paced)",
        price: 21999,
        currency: "INR",
        provider: "Celoris Designs",
        website: "https://www.celorisdesigns.com",
        url: "https://www.celorisdesigns.com/courses/architecting-trust-ai-safety-ethics-compliance",
        learning_outcomes: [
            "Identify and mitigate algorithmic bias using state-of-the-art technical remediation.",
            "Implement Explainable AI (XAI) libraries (SHAP, LIME) into production pipelines.",
            "Navigate complex regulatory landscapes like the EU AI Act and NIST AI RMF.",
            "Protect AI systems against adversarial attacks like prompt injection and data poisoning.",
            "Establish cross-functional AI oversight boards and incident response protocols.",
            "Quantify the 'Ethical ROI' and treat trust as a competitive advantage."
        ],
        requirements: [
            "Basic understanding of Machine Learning concepts",
            "Familiarity with Python (for technical modules)",
            "Interest in AI Governance and Corporate Compliance",
            "No advanced Math PhD required"
        ],
        chapters: [
            {
                number: 1,
                title: "The Foundations of Trustworthy AI",
                icon: "Shield",
                topics: [
                    "The Trust Gap: Why consumers and regulators are wary of 'Black Box' systems.",
                    "Defining the Pillars: Fairness, Robustness, Explainability, and Privacy.",
                    "The Cost of Failure: Case studies on algorithmic bias and security breaches.",
                    "Alignment: Ensuring AI objectives match human values and corporate ROI."
                ],
                duration: "1 Week",
                videoUrl: "https://www.youtube.com/embed/BaUPz52yDQM"
            },
            {
                number: 2,
                title: "Bias Detection & Mitigation (Technical)",
                icon: "Binary",
                topics: [
                    "Identifying Bias: Historical, representation, and measurement bias in training data.",
                    "Technical Remediation: Pre-processing (re-weighing), In-processing (adversarial de-biasing), Post-processing (equalized odds).",
                    "Tooling: Hands-on with Fairlearn, AIF360, and Google’s What-If Tool."
                ],
                duration: "1.5 Weeks"
            },
            {
                number: 3,
                title: "Explainable AI (XAI) & Interpretability",
                icon: "Eye",
                topics: [
                    "The Interpretability Spectrum: Global vs. Local explainability.",
                    "Glass-Box Models: Prioritizing decision trees and linear models over Deep Learning.",
                    "Post-hoc Explanations: Implementing SHAP and LIME architectures.",
                    "Stakeholder Communication: Translating feature importance for non-technical auditors."
                ],
                duration: "1.5 Weeks"
            },
            {
                number: 4,
                title: "Privacy, Security & Adversarial Robustness",
                icon: "Lock",
                topics: [
                    "Data Privacy: Techniques for Differential Privacy and Federated Learning.",
                    "Adversarial AI: Protecting against prompt injection and model inversion.",
                    "Red Teaming: Organizing internal 'attack teams' to find vulnerabilities.",
                    "Anonymization vs. Pseudonymization: Practical data governance for LLMs."
                ],
                duration: "1 Week"
            },
            {
                number: 5,
                title: "The Regulatory Landscape & AI Governance",
                icon: "Gavel",
                topics: [
                    "The EU AI Act: Navigating High-risk vs. Low-risk systems.",
                    "NIST AI Risk Management Framework: The Gold Standard for governance.",
                    "Audit Trails: Documentation for model cards, data cards, and transparency.",
                    "Liability Models: Who is responsible when the AI makes a mistake?"
                ],
                duration: "1 Week"
            },
            {
                number: 6,
                title: "Operationalizing Ethics (The Roadmap)",
                icon: "Activity",
                topics: [
                    "The Ethics Committee: Building a cross-functional AI oversight board.",
                    "Incident Response: Creating a 'Kill Switch' and roll-back protocols.",
                    "Continuous Monitoring: Tracking drift and bias in production environments.",
                    "Ethical ROI: Quantifying trust as a competitive advantage."
                ],
                duration: "1 Week"
            }
        ],
        projects: [
            {
                title: "The Bias Audit Lab",
                description: "Clean a 'toxic' dataset to meet fairness metrics using Fairlearn.",
                tools: "Python + Fairlearn + AIF360",
                icon: "Binary"
            },
            {
                title: "The Policy Workshop",
                description: "Draft a 'Company AI Ethics Charter' for Healthcare or Finance.",
                tools: "Framework: NIST AI RMF",
                icon: "FileText"
            },
            {
                title: "Adversarial Simulation",
                description: "Attempt to 'break' a model in a sandboxed environment to find injection flaws.",
                tools: "Red Teaming Toolkit",
                icon: "AlertTriangle"
            }
        ],
        faqs: [
            {
                question: "Is this course only for lawyers and compliance officers?",
                answer: "Not at all. While essential for compliance, Module 2 and 3 are highly technical and designed for Engineers and Data Scientists who need to implement these safeguards in code."
            },
            {
                question: "Will I get a certificate?",
                answer: "Yes, upon completion of the 'Bias Audit' and 'Policy Workshop' projects, you will receive a Professional Certification in AI Safety & Governance."
            },
            {
                question: "Does this cover the latest LLM safety issues?",
                answer: "Yes, we have dedicated sections on prompt injection, jailbreaking LLMs, and Hallucination mitigation strategies."
            },
            {
                question: "Is this based on US or EU laws?",
                answer: "Both. We cover the EU AI Act (the most comprehensive law) and the NIST framework (the US standard), as most global companies must comply with both."
            }
        ],
        quiz_data: [
            {
                title: "Fundamentals of Agentic AI in Cybersecurity",
                questions: [
                    {
                        question: "What is the primary distinguishing feature of Agentic AI compared to traditional AI?",
                        options: ["It only responds to predefined prompts.", "It operates with cognitive autonomy and is goal-directed.", "It requires constant human oversight for every task.", "It cannot adapt to dynamic environments."],
                        correctIndex: 1
                    },
                    {
                        question: "Which theory does Agentic AI align with for intelligent agent design?",
                        options: ["Linear programming.", "Theories of autonomy and adaptivity.", "Static rule-based logic.", "Perimeter-based protection."],
                        correctIndex: 1
                    },
                    {
                        question: "Why is Agentic AI increasingly valuable in the current cybersecurity landscape?",
                        options: ["Due to the scarcity of skilled professionals and growing threat complexity.", "Because it is cheaper to build than traditional software.", "It eliminates the need for any human intervention forever.", "It relies solely on static rules."],
                        correctIndex: 0
                    },
                    {
                        question: "What does 'Cognitive Autonomy' denote in the context of AAI?",
                        options: ["The ability to follow a checklist.", "The capacity to independently process information and generate novel solutions.", "A system that only functions when connected to a human operator.", "A method for strictly limiting AI decision-making."],
                        correctIndex: 1
                    },
                    {
                        question: "Which architectural framework enables AAI to emulate human-like reasoning while maintaining speed?",
                        options: ["Neuromorphic frameworks integrated with reinforcement learning.", "Basic SQL databases.", "Perimeter-based firewalls.", "Static pattern matching."],
                        correctIndex: 0
                    }
                ]
            },
            {
                title: "The Three Pillars and Design Patterns",
                questions: [
                    {
                        question: "What are the three foundational pillars of the AAI conceptual framework?",
                        options: ["Speed, Cost, and Accuracy.", "Cognitive Autonomy, Ethical Governance, and Quantum Resilience.", "Data, Hardware, and Software.", "Detection, Response, and Recovery."],
                        correctIndex: 1
                    },
                    {
                        question: "Which design pattern involves an agent acting autonomously but escalating to a human under uncertainty?",
                        options: ["Reactive Agents.", "Human-in-the-Loop.", "Federated Agent Networks.", "Reflexive Cognitive Loops."],
                        correctIndex: 1
                    },
                    {
                        question: "What is the 'TriQPAN' architectural pattern used for?",
                        options: ["Reducing hardware energy consumption.", "Embedding explainability into the agent's decision loop.", "Automating SQL injections.", "Encrypting data at rest."],
                        correctIndex: 1
                    },
                    {
                        question: "In the evolution of AAI, what characterized the period between 2010 and 2020?",
                        options: ["Rule-based automation.", "Machine Learning Integration for anomaly detection.", "Fully autonomous collaborative agents.", "Generative AI dominance."],
                        correctIndex: 1
                    },
                    {
                        question: "What is a 'Reflexive Cognitive Loop'?",
                        options: ["A simple rule-based response.", "An agent that reasons about its own confidence and ethics.", "A loop that only functions during the training phase.", "A method for data poisoning."],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Adversarial Machine Learning (AML) Taxonomy",
                questions: [
                    {
                        question: "According to the NIST taxonomy, what is the primary goal of an 'Availability' attack?",
                        options: ["To extract model weights.", "To disrupt access to a system’s services.", "To change a specific classification label.", "To reveal training data secrets."],
                        correctIndex: 1
                    },
                    {
                        question: "When do 'Poisoning Attacks' typically occur in the ML lifecycle?",
                        options: ["During the deployment stage.", "During the training stage.", "Only during human oversight reviews.", "After the model has been retired."],
                        correctIndex: 1
                    },
                    {
                        question: "What is 'Evasion' in the context of AML?",
                        options: ["Modifying testing samples to induce misclassification at deployment.", "Deleting the entire training dataset.", "Stealing the model's source code.", "Training a model with incorrect labels."],
                        correctIndex: 0
                    },
                    {
                        question: "What defines a 'Clean-label Poisoning' attack?",
                        options: ["The attacker controls the labels of training samples.", "The attacker cannot control the labels but modifies training examples.", "The attacker removes all labels from the dataset.", "The labels are manually verified by humans."],
                        correctIndex: 1
                    },
                    {
                        question: "Which attack aims to extract information about a model’s architecture or parameters?",
                        options: ["Targeted Poisoning.", "Model Extraction.", "Evasion.", "Energy-latency attack."],
                        correctIndex: 1
                    },
                    {
                        question: "What is an 'Energy-Latency' attack?",
                        options: ["An attack that steals electricity.", "A black-box attack that negates hardware optimisations to increase latency and energy use.", "A method for improving model speed.", "A type of privacy breach."],
                        correctIndex: 1
                    },
                    {
                        question: "What is 'Label Flipping'?",
                        options: ["A method for correcting biased data.", "A poisoning strategy where an adversary alters training labels.", "A technique for data reconstruction.", "Rotating images to test robustness."],
                        correctIndex: 1
                    },
                    {
                        question: "Which privacy attack determines if a specific record was used to train a model?",
                        options: ["Model Inversion.", "Membership Inference.", "Property Inference.", "Data Sanitization."],
                        correctIndex: 1
                    },
                    {
                        question: "What is a 'Backdoor Pattern' (or Trojan trigger)?",
                        options: ["A standard security patch.", "A transformation added to a sample to trigger an adversary-specified behaviour.", "A method for encrypting training data.", "A redundant node in a neural network."],
                        correctIndex: 1
                    },
                    {
                        question: "What is 'Adversarial Training'?",
                        options: ["Training humans to hack AI.", "A mitigation that augments training data with adversarial examples.", "A method for reducing the size of a model.", "A way to increase model bias."],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Generative AI and Agentic Risks",
                questions: [
                    {
                        question: "What is the 'Dual-use Dilemma' in Agentic AI?",
                        options: ["Using two models at the same time.", "Tools designed for defense can be repurposed for offensive exploitation.", "The high cost of running agents in the cloud.", "The conflict between accuracy and speed."],
                        correctIndex: 1
                    },
                    {
                        question: "How does 'Indirect Prompt Injection' differ from direct injection?",
                        options: ["It requires the user to type the malicious command.", "It is executed through external resources (like web pages) ingested by the model.", "It only affects the model’s energy consumption.", "It is impossible to detect with current tools."],
                        correctIndex: 1
                    },
                    {
                        question: "What is a 'Jailbreak' in GenAI?",
                        options: ["Updating the software to a newer version.", "A direct prompting attack intended to circumvent refusal behaviour.", "Stealing the hardware where the model is stored.", "Bypassing a login screen."],
                        correctIndex: 1
                    },
                    {
                        question: "Which technique involves an attacker asking a model to repeat its system instructions?",
                        options: ["Data poisoning.", "Prompt Extraction.", "Evasion.", "Model Inversion."],
                        correctIndex: 1
                    },
                    {
                        question: "What is 'Retrieval-Augmented Generation' (RAG)?",
                        options: ["A method for deleting old data.", "Pairing an AI model with a knowledge base to provide real-time context.", "A way to train a model without any data.", "A type of computer virus."],
                        correctIndex: 1
                    },
                    {
                        question: "In RAG systems, what is 'Knowledge Base Poisoning'?",
                        options: ["Deleting the entire database.", "Inserting malicious documents to influence the model's generated output.", "Encrypting the knowledge base with lattice-based algorithms.", "Increasing the number of user queries."],
                        correctIndex: 1
                    },
                    {
                        question: "What is 'Fine-tuning Circumvention'?",
                        options: ["Improving the speed of fine-tuning.", "Removing refusal behaviour or safety interventions via fine-tuning.", "Training a model on only one image.", "A method for data sanitization."],
                        correctIndex: 1
                    },
                    {
                        question: "Which GenAI attack uses techniques like 'Base64 encoding' or 'Morse code' to bypass filters?",
                        options: ["Optimization-based attacks.", "Mismatched Generalisation.", "Prompt Extraction.", "Role-play."],
                        correctIndex: 1
                    },
                    {
                        question: "What is 'Token Smuggling'?",
                        options: ["Stealing API keys.", "Breaking sensitive words into substrings to evade detection.", "Selling AI tokens on the black market.", "Encrypting data before it is sent to the cloud."],
                        correctIndex: 1
                    },
                    {
                        question: "What is an 'LLM-based Agent'?",
                        options: ["A human who manages an AI.", "A software system that iteratively prompts a model and takes actions with tools.", "A model that only generates text.", "A firewall for large language models."],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Governance, Regulations, and Standards",
                questions: [
                    {
                        question: "What is the primary difference between ISO/IEC 42001 and the NIST AI RMF?",
                        options: ["NIST is international, ISO is for the USA.", "ISO 42001 is certifiable, while the NIST AI RMF is voluntary.", "NIST only covers hardware, ISO covers ethics.", "ISO 42001 is only for startups."],
                        correctIndex: 1
                    },
                    {
                        question: "What are the four core functions of the NIST AI Risk Management Framework?",
                        options: ["Plan, Do, Check, Act.", "Govern, Map, Measure, and Manage.", "Secure, Defend, Thwart, and Recover.", "Detect, Identify, Respond, and Protect."],
                        correctIndex: 1
                    },
                    {
                        question: "What is the 'Plan-Do-Check-Act' (PDCA) model used for?",
                        options: ["Breaking into a system.", "The structured operational approach for ISO/IEC 42001.", "Generating adversarial prompts.", "Encrypting quantum communications."],
                        correctIndex: 1
                    },
                    {
                        question: "Which regulation adopts a 'risk-based approach,' classifying AI systems into risk categories?",
                        options: ["The US Bill of Rights.", "The EU AI Act.", "The ISO 27001 standard.", "The GDPR exclusively."],
                        correctIndex: 1
                    },
                    {
                        question: "What does the 'Secure' focus area of the NIST AI Cybersecurity Framework address?",
                        options: ["Enhancing defense capabilities.", "Managing challenges within AI systems themselves (data, models, infrastructure).", "Blocking external cyberattacks.", "Training human employees."],
                        correctIndex: 1
                    },
                    {
                        question: "What is 'Algorithmic Accountability'?",
                        options: ["The speed at which an algorithm runs.", "The principle that entities are answerable for how their algorithms operate.", "A method for calculating ROI.", "The number of nodes in a network."],
                        correctIndex: 1
                    },
                    {
                        question: "Which standard provides a certifiable management system for AI governance?",
                        options: ["NIST AI RMF.", "ISO/IEC 42001:2023.", "IEEE 7000.", "OECD AI Principles."],
                        correctIndex: 1
                    },
                    {
                        question: "What is the 'Privacy-by-Design' approach?",
                        options: ["Making an AI system look pretty.", "Embedding privacy and data protection into the development process from the outset.", "Hiding the source code from everyone.", "Designing a model after a breach has occurred."],
                        correctIndex: 1
                    },
                    {
                        question: "What is a 'Bias Profile' as recommended by IEEE 7003-2024?",
                        options: ["A social media profile for AI.", "A document to identify and assess bias risks throughout the system lifecycle.", "A way to increase representation bias.", "A list of all employees working on a project."],
                        correctIndex: 1
                    },
                    {
                        question: "What is 'Minimum Viable Governance' (MVG)?",
                        options: ["Having no rules at all.", "Applying lightweight, scalable controls across frameworks to protect innovation.", "The absolute maximum amount of regulation possible.", "A specific law in the EU."],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Implementation, ROI, and Future Trends",
                questions: [
                    {
                        question: "What is the 'ROI of AI Ethics' based on the IBM Research?",
                        options: ["Firms with an ethics strategy achieve ~13% ROI vs 5.9% for those without.", "Ethical firms always lose money.", "Ethics has no measurable impact on revenue.", "Companies only achieve ROI by ignoring ethics."],
                        correctIndex: 0
                    },
                    {
                        question: "Which 'Horizon' in the McKinsey model focuses on 'Breakthrough Innovation'?",
                        options: ["Horizon 1.", "Horizon 2.", "Horizon 3.", "Horizon 0."],
                        correctIndex: 2
                    },
                    {
                        question: "What is a major barrier to the deployment of Agentic AI in cybersecurity?",
                        options: ["Too many skilled professionals.", "Skills shortages and integration complexity with legacy systems.", "The technology is too old.", "There is no interest from the military."],
                        correctIndex: 1
                    },
                    {
                        question: "How does 'Quantum-Resilient Defense' protect against Shor's algorithm?",
                        options: ["By increasing the speed of traditional RSA encryption.", "By using post-quantum cryptography (PQC) like lattice-based schemes.", "By shutting down all quantum computers.", "By using simple 8-bit passwords."],
                        correctIndex: 1
                    },
                    {
                        question: "What is 'Machine Unlearning'?",
                        options: ["Forgetting everything you know about AI.", "A technique to selectively remove the influence of training data from a model.", "A method for deleting a model's weights entirely.", "Training a model on paper instead of digital data."],
                        correctIndex: 1
                    },
                    {
                        question: "Which sector uses AI for 'Avionics security' and 'Adversarial modeling'?",
                        options: ["Finance.", "Healthcare.", "Aviation.", "Real Estate."],
                        correctIndex: 2
                    },
                    {
                        question: "What is 'Neurosymbolic AI'?",
                        options: ["AI that only uses neural networks.", "A method combining symbolic knowledge graphs with deep learning for better reasoning.", "A system that mimics a biological brain exactly.", "A way to poison data using symbols."],
                        correctIndex: 1
                    },
                    {
                        question: "What does 'Cognitive Agility' refer to in leadership for an emergent world?",
                        options: ["The ability to run very fast.", "The capacity to continuously unlearn and re-learn to shift mental models.", "Being able to program in ten different languages.", "Ignoring all new technology."],
                        correctIndex: 1
                    },
                    {
                        question: "What is 'Metabolic Leadership'?",
                        options: ["Leading a fitness gym.", "The capacity for an organisation to process stress and convert risk into learning.", "A method for reducing energy costs in a data centre.", "A way to automate payroll."],
                        correctIndex: 1
                    },
                    {
                        question: "What is the long-term focus (7+ years) for Agentic AI research?",
                        options: ["Static rule-based firewalls.", "Quantum-enhanced multi-agent reinforcement learning.", "Replacing all computers with paper.", "Building better 1980s-style expert systems."],
                        correctIndex: 1
                    }
                ]
            }
        ],
        reviews: [
            {
                name: "Rishabh Mehra",
                role: "Machine Learning Engineer",
                rating: 5,
                comment: "This course finally brought clarity to AI safety beyond theory. The bias mitigation labs using Fairlearn and AIF360 were extremely practical and directly applicable to my production workflows."
            },
            {
                name: "Ananya Iyer",
                role: "AI Product Manager",
                rating: 5,
                comment: "I loved how the course connects ethics to business outcomes. The concept of ‘Ethical ROI’ completely changed how I think about trust as a competitive advantage."
            },
            {
                name: "Karthik Reddy",
                role: "Data Scientist",
                rating: 4,
                comment: "The Explainable AI module was excellent. Implementing SHAP and LIME in real scenarios helped me explain model decisions clearly to both stakeholders and auditors."
            },
            {
                name: "Neha Kapoor",
                role: "Compliance & Risk Analyst",
                rating: 5,
                comment: "This is one of the few courses that explains the EU AI Act and NIST AI RMF in a way that is actually usable. I feel confident participating in AI audits now."
            },
            {
                name: "Arjun Malhotra",
                role: "AI Security Researcher",
                rating: 5,
                comment: "The adversarial simulation lab was a highlight. Prompt injection and data poisoning attacks were demonstrated realistically, which helped me understand real-world risks much better."
            },
            {
                name: "Pooja Choudhary",
                role: "Healthcare AI Consultant",
                rating: 4,
                comment: "The Policy Workshop was extremely valuable. Drafting an AI Ethics Charter helped me understand governance from an organizational perspective, not just a technical one."
            },
            {
                name: "Sandeep Kulkarni",
                role: "Engineering Manager",
                rating: 5,
                comment: "This course bridges the gap between engineering and leadership. The guidance on AI oversight boards and incident response protocols is exactly what enterprises need."
            },
            {
                name: "Aditi Sharma",
                role: "AI Governance Specialist",
                rating: 5,
                comment: "The structured roadmap for operationalizing ethics was excellent. It’s rare to find a course that moves beyond awareness and actually shows how to implement ethical AI."
            },
            {
                name: "Rohit Verma",
                role: "Startup Founder – AI SaaS",
                rating: 4,
                comment: "As a founder, this course helped me understand how compliance and safety can strengthen market trust. The lessons on treating ethics as a growth strategy were eye-opening."
            },
            {
                name: "Vikram Singh",
                role: "Cybersecurity Architect",
                rating: 5,
                comment: "The integration of agentic AI risks and adversarial ML taxonomy was very well done. This course is a must for anyone deploying AI in high-risk or regulated environments."
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Architecting Trust: AI Safety, Ethics & Compliance",
        "description": "Master AI safety, bias mitigation, and regulatory compliance for modern enterprises.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs",
            "sameAs": "https://www.celorisdesigns.com"
        },
        "educationalLevel": "Intermediate to Advanced",
        "teaches": [
            "AI Bias Detection",
            "Explainable AI (XAI)",
            "EU AI Act Compliance",
            "Adversarial Robustness",
            "AI Governance Frameworks",
            "Model Interpretability"
        ]
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-8 selection:bg-gold-500/30">
            {/* JSON-LD Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
                    <Link href="/" className="hover:text-gold-400 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-gold-400 transition-colors">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-gold-400 transition-colors">Courses</Link>
                    <span>/</span>
                    <span className="text-slate-100 line-clamp-1">{courseData.title}</span>
                </div>

                {/* Back Button */}
                <Link href="/learn/courses" className="inline-flex items-center text-slate-400 hover:text-gold-400 mb-6 transition-all group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Course Header */}
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-gold-500/10 text-gold-400 border border-gold-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">AI Ethics</span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Compliance</span>
                                <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">AI Safety</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-gold-200">
                                {courseData.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-gold-400/90 font-medium">
                                {courseData.subtitle}
                            </p>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
                                {courseData.description}
                            </p>
                        </div>

                        {/* Course Preview Video */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-gold-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Card className="relative overflow-hidden border-0 bg-slate-900/50 backdrop-blur-xl rounded-2xl">
                                <div className="aspect-video relative overflow-hidden">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src="https://www.youtube.com/embed/CdCAuee0qyI?autoplay=0&rel=0"
                                        title="Architecting Trust: AI Safety, Ethics & Compliance"
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
                                <div className="p-2 bg-gold-500/20 rounded-lg">
                                    <ShieldCheck className="h-6 w-6 text-gold-400" />
                                </div>
                                Core Learning Outcomes
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courseData.learning_outcomes.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-gold-500/30 transition-colors group">
                                        <div className="h-5 w-5 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-gold-500/20 transition-colors">
                                            <CheckCircle className="h-3 w-3 text-gold-400" />
                                        </div>
                                        <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Curriculum */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <BookOpen className="h-6 w-6 text-blue-400" />
                                </div>
                                Curriculum Overview
                            </h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {courseData.chapters.map((chapter, index) => {
                                    const Icon = chapter.icon === "Shield" ? Shield :
                                        chapter.icon === "Binary" ? Binary :
                                            chapter.icon === "Eye" ? Eye :
                                                chapter.icon === "Lock" ? Lock :
                                                    chapter.icon === "Gavel" ? Gavel : Activity;
                                    return (
                                        <AccordionItem key={index} value={`chapter-${index}`} className="border border-slate-700/50 bg-slate-900/40 rounded-xl px-2 overflow-hidden">
                                            <AccordionTrigger className="hover:no-underline py-6">
                                                <div className="flex items-center gap-4 text-left w-full">
                                                    <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 shadow-inner">
                                                        <Icon className="h-6 w-6 text-gold-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-1">Module {chapter.number}</div>
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
                                                    <div className="h-px bg-gradient-to-r from-gold-500/30 to-transparent mb-4"></div>

                                                    {chapter.videoUrl && (
                                                        <div className="mb-6 overflow-hidden rounded-xl border border-slate-700/50 bg-slate-950 aspect-video">
                                                            <iframe
                                                                width="100%"
                                                                height="100%"
                                                                src={chapter.videoUrl}
                                                                title={`${chapter.title} Video`}
                                                                frameBorder="0"
                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                                allowFullScreen
                                                                className="w-full h-full"
                                                            ></iframe>
                                                        </div>
                                                    )}

                                                    <ul className="grid grid-cols-1 gap-3">
                                                        {chapter.topics.map((topic, topicIndex) => (
                                                            <li key={topicIndex} className="flex items-start gap-3 text-slate-400 group">
                                                                <div className="h-1.5 w-1.5 rounded-full bg-gold-500/40 mt-2 group-hover:bg-gold-500 transition-colors" />
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

                        {/* Projects */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <Scale className="h-6 w-6 text-purple-400" />
                                </div>
                                Practical Simulations & Labs
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {courseData.projects.map((item, index) => {
                                    const Icon = item.icon === "Binary" ? Binary : item.icon === "FileText" ? FileText : AlertTriangle;
                                    return (
                                        <Card key={index} className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 hover:border-gold-500/40 transition-all duration-300 group">
                                            <CardContent className="pt-8 text-center h-full flex flex-col">
                                                <div className="mx-auto bg-slate-700/50 p-4 w-fit rounded-2xl border border-slate-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                                    <Icon className="h-8 w-8 text-gold-400" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                                <p className="text-sm text-slate-400 mb-4 flex-grow">{item.description}</p>
                                                <div className="text-xs font-mono bg-slate-950/50 p-2 rounded border border-slate-700 text-gold-500">
                                                    {item.tools}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </section>

                        {/* Learning Outcomes by Role */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 rounded-lg">
                                    <Users className="h-6 w-6 text-emerald-400" />
                                </div>
                                Learning Path by Role
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { role: "Engineers", takeaway: "Code bias-detection scripts and implement XAI libraries into the CI/CD pipeline." },
                                    { role: "Managers", takeaway: "Frameworks to assess the 'Ethics-to-Revenue' ratio and lead safe AI transitions." },
                                    { role: "Compliance", takeaway: "Deep understanding of the EU AI Act and NIST to ensure company passes external audits." }
                                ].map((path, i) => (
                                    <div key={i} className="p-6 rounded-2xl bg-slate-800/20 border border-slate-700/50">
                                        <div className="text-sm font-bold text-gold-400 uppercase mb-2">{path.role}</div>
                                        <p className="text-sm text-slate-300 leading-relaxed">{path.takeaway}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* FAQ */}
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

                        {/* Student Reviews Section */}
                        <section className="space-y-6 pt-12 border-t border-slate-800/50">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-yellow-500/20 rounded-lg">
                                    <MessageSquare className="h-6 w-6 text-yellow-400" />
                                </div>
                                Student Reviews
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {courseData.reviews.map((review, index) => (
                                    <div key={index} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-gold-500/30 transition-all group">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h4 className="font-bold text-white">{review.name}</h4>
                                                <p className="text-xs text-slate-400">{review.role}</p>
                                            </div>
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-3 w-3 ${i < review.rating ? "fill-gold-400 text-gold-400" : "text-slate-600"}`}
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
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <div className="p-2 bg-gold-500/20 rounded-lg">
                                        <Trophy className="h-6 w-6 text-gold-400" />
                                    </div>
                                    Mastery Assessment: AI Safety, Ethics & Compliance
                                </h2>
                                <p className="text-slate-400 mt-2">Validate your expertise in AI governance, adversarial machine learning, and regulatory frameworks.</p>
                            </div>
                            <InteractiveQuiz
                                quizTitle="Architecting Trust Mastery"
                                quizDescription="50 comprehensive questions covering fundamentals, risk management, and implementation of ethical AI systems."
                                quizUnits={courseData.quiz_data}
                                onCompleteMessage={(score) => {
                                    if (score >= 45) return "AI Safety Architect Expert Grade! Your understanding of ethical frameworks and technical remediation is exceptional.";
                                    if (score >= 35) return "Compliance Specialist! You have a solid grasp of NIST and EU AI Act requirements. Continue focusing on technical bias mitigation strategies.";
                                    return "Good attempt! Review the modules on AML taxonomy and ISO/IEC 42001 standards to strengthen your foundational knowledge of AI trust.";
                                }}
                            />
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-8">
                            {/* Enrollment Card */}
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-gold-500 to-blue-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                <Card className="relative bg-slate-900 border-0 rounded-3xl overflow-hidden shadow-2xl">
                                    <CardContent className="p-8">
                                        <div className="text-center mb-8">
                                            <div className="text-5xl font-extrabold text-white mb-2 tracking-tighter">
                                                ₹{courseData.price}
                                            </div>
                                            <div className="text-gold-400 font-bold tracking-widest uppercase text-xs">Professional Excellence Tier</div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <CourseInquiryDialog
                                                courseTitle={courseData.title}
                                                buttonClassName="w-full h-14 text-lg font-bold bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-white rounded-2xl shadow-lg shadow-gold-500/25 transition-all active:scale-95"
                                            />
                                            <Button
                                                variant="outline"
                                                className="w-full h-12 border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl flex items-center justify-center gap-2 group transition-all"
                                                onClick={() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })}
                                            >
                                                <Trophy className="h-4 w-4 text-gold-400 group-hover:scale-110 transition-transform" />
                                                Take Mastery Quiz
                                            </Button>
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-slate-800">
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Award className="h-5 w-5 text-gold-400" />
                                                <span>Professional Certification</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Activity className="h-5 w-5 text-blue-400" />
                                                <span>Bias Remediation Toolkit</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Gavel className="h-5 w-5 text-purple-400" />
                                                <span>Regulatory Compliance Maps</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <RotateCcw className="h-5 w-5 text-red-400" />
                                                <span>Incident Response Playbooks</span>
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
                                        <div className="w-14 h-14 rounded-2xl bg-white p-2.5 shadow-lg shadow-white/5 border border-slate-200 flex items-center justify-center">
                                            <img src="/celoris-logo.png" alt="Celoris" className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">Celoris Designs</h4>
                                            <p className="text-xs text-slate-400">Excellence in AI Safety</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                        We specialize in operationalizing AI safety for the modern enterprise. From technical bias mitigation to boardroom governance, we bridge the trust gap.
                                    </p>
                                    <div className="flex items-center justify-between text-sm py-3 border-t border-slate-800">
                                        <div className="flex items-center gap-1.5 text-slate-300">
                                            <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
                                            <span className="font-bold">{courseData.rating}</span>
                                            <span className="text-slate-500">({courseData.students}+)</span>
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
                                    <Shield className="h-5 w-5 text-blue-400" />
                                    Prerequisites
                                </h3>
                                <ul className="space-y-3">
                                    {courseData.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm text-slate-400">
                                            <div className="h-1.5 w-1.5 rounded-full bg-gold-500/40 mt-1.5 flex-shrink-0" />
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
